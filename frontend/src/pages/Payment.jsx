import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api";
import "./Payment.css";

/*
  Payment Page
  - Receives booking data from Booking page via navigate(..., { state })
  - Starts MTN MoMo payment request
  - Verifies payment
  - Creates appointment(s) ONLY after payment is successful
*/

const Payment = () => {
   // What it does: reads data passed from Booking page via navigate("/payment", { state: {...} })
  const navigate = useNavigate();
  const location = useLocation();

  // What it does: defines these variables so ESLint stops complaining
  const selectedServices = location.state?.services || [];
  const selectedDate = location.state?.selectedDate || localStorage.getItem("selectedDate") || "";
  const selectedTime = location.state?.selectedTime || localStorage.getItem("selectedTime") || "";


  // Booking data passed from Booking page
  const bookingState = location.state;

  const [phone, setPhone] = useState("");
  const [txId, setTxId] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Protect page + require booking payload
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true, state: { redirectTo: "/payment" } });
      return;
    }

    // If user opens /payment directly without state, go back to booking
    if (!bookingState?.services?.length || !bookingState?.date || !bookingState?.time) {
      navigate("/book", { replace: true });
    }
  }, [bookingState, navigate]);

  // Compute totals (booking fee + totals)
  const totals = useMemo(() => {
    const services = bookingState?.services || [];
    const bookingFeeTotal = services.reduce((sum, s) => sum + (Number(s.bookingFee) || 0), 0);
    const serviceTotal = services.reduce((sum, s) => sum + (Number(s.price) || 0), 0);
    const durationTotal = services.reduce((sum, s) => sum + (Number(s.duration) || 0), 0);

    return { bookingFeeTotal, serviceTotal, durationTotal };
  }, [bookingState]);

  // Start payment request (MoMo push)
  const startPayment = async () => {
    setError("");
    setMessage("");

    if (!phone.trim()) {
      setError("Please enter your MTN phone number.");
      return;
    }

    try {
      setLoading(true);

      // amount: you can charge booking fee only OR service total + booking fee
      const amountToPay = totals.bookingFeeTotal || 1000; // fallback

      const res = await API.post("/payments/start", {
        phone,
        amount: amountToPay,
        // optional: attach booking summary so backend can store it
        meta: {
          date: bookingState.date,
          time: bookingState.time,
          services: bookingState.services.map((s) => s._id)
        }
      });

      // Expect backend to return transactionId
      setTxId(res.data.transactionId);
      setMessage("Payment request sent. Approve it on your phone, then click Verify Payment.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to start payment.");
    } finally {
      setLoading(false);
    }
  };

  // Verify payment then create appointment(s)
  const verifyPaymentAndBook = async () => {
    setError("");
    setMessage("");

    if (!txId) {
      setError("No transaction found. Click Pay first.");
      return;
    }

    try {
      setLoading(true);

      // 1) Verify payment
      const verifyRes = await API.post("/payments/verify", {
        transactionId: txId,
        bookingData: {
          services: selectedServices.map((s) => s._id),
          date: selectedDate,
          time: selectedTime,
        }
      });

      // If your backend returns a status, check it
      // Example: verifyRes.data.status === "SUCCESSFUL"
      if (!verifyRes.data?.success) {
        setError(verifyRes.data?.message || "Payment not successful yet. Approve on phone then try again.");
        return;
      }

      // 2) Create appointment(s) after payment success
      // If your backend appointment model supports ONE service per appointment:

      setMessage("Payment verified. Appointment booked successfully!");
      navigate("/account", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Payment not completed yet. Please approve then verify again.");
    } finally {
      setLoading(false);
    }
  };

  const services = bookingState?.services || [];

  return (
    <div className="pay-wrap">
      <div className="pay-card">
        <h2>Payment</h2>
        <p className="pay-sub">Approve the payment on your phone to complete your booking.</p>

        {error && <div className="pay-alert error">{error}</div>}
        {message && <div className="pay-alert success">{message}</div>}

        {/* Summary */}
        <div className="pay-summary">
          <h3>Booking Summary</h3>

          <div className="pay-row">
            <span>Date</span>
            <strong>{bookingState?.date}</strong>
          </div>
          <div className="pay-row">
            <span>Time</span>
            <strong>{bookingState?.time}</strong>
          </div>

          <div className="pay-list">
            {services.map((s) => (
              <div key={s._id} className="pay-item">
                <div>
                  <strong>{s.name}</strong>
                  <div className="muted">
                    {s.duration} mins - {s.price} RWF - Booking fee: {s.bookingFee} RWF
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pay-total">
            <div className="pay-row">
              <span>Total Booking Fees</span>
              <strong>{totals.bookingFeeTotal || 1000} RWF</strong>
            </div>
            <div className="pay-row">
              <span>Total Duration</span>
              <strong>{totals.durationTotal} mins</strong>
            </div>
          </div>
        </div>

        {/* Phone */}
        <label className="pay-label">MTN phone number</label>
        <input
          className="pay-input"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="07XXXXXXXX"
        />

        {/* Actions */}
        {!txId ? (
          <button className="pay-btn" onClick={startPayment} disabled={loading}>
            {loading ? "Sending request..." : "Pay Now"}
          </button>
        ) : (
          <>
            <div className="pay-tx">
              Transaction: <strong>{txId}</strong>
            </div>

            {/*  THIS IS WHERE THE VERIFY PAYMENT BUTTON GOES */}
            <button className="pay-btn" onClick={verifyPaymentAndBook} disabled={loading}>
              {loading ? "Verifying..." : "Verify Payment"}
            </button>

            <button
              className="pay-btn secondary"
              onClick={() => {
                setTxId("");
                setMessage("");
                setError("");
              }}
              disabled={loading}
            >
              Start New Payment
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Payment;
