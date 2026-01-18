const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const Appointment = require("../models/Appointment");
const mongoose = require("mongoose");
const Service = require("../models/Service");


// ================================
// GET MTN ACCESS TOKEN
// ================================
const getMomoToken = async () => {
  const res = await axios.post(
    `${process.env.MTN_BASE_URL}/collection/token/`,
    {},
    {
      headers: {
        "Ocp-Apim-Subscription-Key": process.env.MTN_SUBSCRIPTION_KEY,
        Authorization:
          "Basic " +
          Buffer.from(
            `${process.env.MTN_API_USER}:${process.env.MTN_API_KEY}`
          ).toString("base64"),
      },
    }
  );

  return res.data.access_token;
};

// ================================
// START PAYMENT
// ================================
const startPayment = async (req, res) => {
  try {
    const { phone, amount } = req.body;

    if (!phone || !amount) {
      return res.status(400).json({ message: "Phone and amount required" });
    }

    const token = await getMomoToken();
    const referenceId = uuidv4();

    await axios.post(
      `${process.env.MTN_BASE_URL}/collection/v1_0/requesttopay`,
      {
        amount: amount.toString(),
        currency: process.env.MTN_CURRENCY || "EUR",
        externalId: referenceId,
        payer: {
          partyIdType: "MSISDN",
          partyId: phone,
        },
        payerMessage: "Booking payment",
        payeeNote: "Appointment booking",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Reference-Id": referenceId,
          "X-Target-Environment": process.env.MTN_TARGET_ENV,
          "Ocp-Apim-Subscription-Key": process.env.MTN_SUBSCRIPTION_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      message: "Payment request sent to phone",
      transactionId: referenceId,
    });
  } catch (error) {
    console.error("START PAYMENT ERROR:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to start payment" });
  }
};

// ================================
// VERIFY PAYMENT & BOOK APPOINTMENT
// ================================
// What it does: Verify MoMo payment status, then create appointment(s) for the logged-in user.
const verifyPayment = async (req, res) => {
  try {
    const { transactionId, bookingData } = req.body;

    if (!transactionId) {
      return res.status(400).json({ message: "Transaction ID required" });
    }

    if (!bookingData) {
      return res.status(400).json({ message: "bookingData is required" });
    }

    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Idempotency: return existing appointments for this transaction
    const existingAppointments = await Appointment.find({
      transactionId,
      user: userId,
    });
    if (existingAppointments.length) {
      return res.json({
        success: true,
        message: "Payment already verified",
        appointments: existingAppointments,
      });
    }

    const services =
      bookingData.services || (bookingData.service ? [bookingData.service] : []);
    const { date, time } = bookingData;

    if (!services.length || !date || !time) {
      return res.status(400).json({
        message: "bookingData must include services (or service), date, and time",
      });
    }

        const uniqueServices = [...new Set(services)];

    const invalidIds = uniqueServices.filter(
      (id) => !mongoose.Types.ObjectId.isValid(id)
    );
    if (invalidIds.length) {
      return res.status(400).json({
        message: "Invalid service id(s)",
        invalidIds,
      });
    }

    const foundServices = await Service.find({
      _id: { $in: uniqueServices },
    }).select("_id");

    if (foundServices.length !== uniqueServices.length) {
      return res.status(400).json({ message: "One or more services not found" });
    }


    const token = await getMomoToken();

    const response = await axios.get(
      `${process.env.MTN_BASE_URL}/collection/v1_0/requesttopay/${transactionId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Target-Environment": process.env.MTN_TARGET_ENV,
          "Ocp-Apim-Subscription-Key": process.env.MTN_SUBSCRIPTION_KEY,
        },
      }
    );

    if (response.data.status !== "SUCCESSFUL") {
      return res.status(400).json({
        message: `Payment status: ${response.data.status}`,
        status: response.data.status,
      });
    }

    const conflicts = await Appointment.find({
      service: { $in: services },
      date,
      time,
      status: { $ne: "canceled" },
    });

    if (conflicts.length) {
      return res.status(409).json({
        message: "One or more selected services are already booked for this slot",
      });
    }

    const created = [];
    for (const serviceId of services) {
      const appointment = new Appointment({
        user: userId,
        service: serviceId,
        date,
        time,
        status: "confirmed",
        paymentStatus: "paid",
        transactionId,
      });

      await appointment.save();
      created.push(appointment);
    }

    return res.json({
      success: true,
      message: "Payment verified & booking confirmed",
      appointments: created,
    });
  } catch (error) {
    console.error("VERIFY PAYMENT ERROR:", error.response?.data || error.message);
    return res.status(500).json({
      message: "Payment verification failed",
      details: error.response?.data || error.message,
    });
  }
};



// ================================
// EXPORT (COMMONJS)
// ================================
module.exports = { startPayment, verifyPayment };
