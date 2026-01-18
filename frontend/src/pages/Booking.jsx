import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API, { UPLOADS_BASE } from "../api";
import "./Booking.css";

/*
  ================================
  BOOKING PAGE
  - Shows all services
  - User selects multiple services (radio-style UI)
  - Shows booking fee, price, duration
  - Enables Proceed to Payment only if at least one service is selected
  ================================
*/

const Booking = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ================================
  // STATE
  // ================================
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [bookedTimes, setBookedTimes] = useState([]);


  // ================================
  // LOAD SERVICES
  // ================================
  useEffect(() => {
    API
      .get("/services")
      .then((res) => setServices(res.data))
      .catch(() => setError("Failed to load services"));
  }, []);

  useEffect(() => {
    if (location.state?.services) {
      // From Services page
      setSelectedServices(location.state.services);
      localStorage.setItem(
        "cart",
        JSON.stringify(location.state.services)
      );
    } else {
      // On refresh or direct visit
      const saved = localStorage.getItem("cart");
      if (saved) {
        setSelectedServices(JSON.parse(saved));
      }
    }
  }, [location.state]);


  // ================================
  // TOGGLE SERVICE SELECTION
  // ================================
  useEffect(() => {
    if (!selectedDate) return;

    API
      .get(`/appointments/booked?date=${selectedDate}`)
      .then((res) => {
        setBookedTimes(res.data.bookedTimes);
      })
      .catch(() => {
        setBookedTimes([]);
      });
  }, [selectedDate]);

  const toggleService = (service) => {
    let updated;
    const exists = selectedServices.find((s) => s._id === service._id);


    if (exists) {
      // Remove service
      updated = selectedServices.filter((s) => s._id !== service._id)
    } else {
      // Add service
      updated = [...selectedServices, service];
    }
    setSelectedServices(updated);
    localStorage.setItem("cart", JSON.stringify(updated)); // ✅ keep synced
  };

  // ================================
  // CALCULATIONS
  // ================================
  const totalPrice = selectedServices.reduce(
    (sum, s) => sum + s.price,
    0
  );

  const totalBookingFee = selectedServices.reduce(
    (sum, s) => sum + (s.bookingFee || 0),
    0
  );

  const totalDuration = selectedServices.reduce(
    (sum, s) => sum + s.duration,
    0
  );

  // ================================
  // PROCEED TO PAYMENT
  // ================================
  const handleProceed = () => {
    if (selectedServices.length === 0) return;

    // ✅ Ensure date/time selected (you already disable button, but keep safe)
    if (!selectedDate || !selectedTime) {
      setError("Please select date and time.");
      return;
    }
    // What it does: keeps date/time even if Payment page reloads
    localStorage.setItem("selectedDate", selectedDate);
    localStorage.setItem("selectedTime", selectedTime);

    navigate("/payment", {
      state: {
        services: selectedServices,
        date: selectedDate,      // ✅ pass date
        time: selectedTime,      // ✅ pass time

        // keep these for summary display
        totalPrice,
        totalBookingFee,
        totalDuration,

        // ✅ explicitly tell payment to charge booking fee only
        payAmount: totalBookingFee
      }
    });
  };


  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };
  const generateTimeSlots = () => {
    const slots = [];
    let startHour = 8;  // 8:00 AM
    let endHour = 19;   // 7:00 PM
    let gap = 2;        // 2 hour gap

    for (let hour = startHour; hour < endHour; hour += gap) {
      const time = `${hour.toString().padStart(2, "0")}:00`;
      slots.push(time);
    }

    return slots;
  };



  // ================================
  // UI
  // ================================
  return (
    <div className="booking-page">
      <div className="booking-banner">
        <h1>Book in no time</h1>
        <p>Select service and book instantly</p>
      </div>

      {error && <p className="error-text">{error}</p>}

      <div className={`booking-content ${selectedServices.length > 0 ? "has-summary" : ""}`}>

      {/* ================================
          SERVICES GRID
         ================================ */}
      <div className="services-grid">
        {services.map((service) => {
          const isSelected = selectedServices.find(
            (s) => s._id === service._id
          );

          return (
            <label
              key={service._id}
              className={`service-card ${isSelected ? "selected" : ""}`}
            >
              {/* RADIO INPUT */}
              <input
                type="checkbox"
                checked={!!isSelected}
                onChange={() => toggleService(service)}
              />

              {/* SERVICE IMAGE */}
              <img
                src={`${UPLOADS_BASE}/uploads/${service.image}`}
                alt={service.name}
                loading="lazy"
                decoding="async"
              />

              {/* SERVICE INFO */}
              <div className="service-info">
                <h4>{service.name}</h4>
                <p>Duration: {service.duration} mins</p>
                <p>Price: {service.price} RWF</p>
                <p>Booking Fee: {service.bookingFee} RWF</p>
              </div>
            </label>
          );
        })}
      </div>

      {/* ================================
          SUMMARY
         ================================ */}
      <div className={`booking-summary ${selectedServices.length > 0 ? "active" : ""}`}>
        <h3 className="head-text">Booking Summary</h3>

        {selectedServices.length === 0 ? (
          <p className="text-muted">No service selected at the moment.</p>
        ) : (
          <>
            <ul>
              {selectedServices.map((s, index) => (
                <li className="cart-service-item" key={s._id}>
                  {index + 1}. {s.name} — {s.price} RWF
                </li>
              ))}
            </ul>
            <hr />
            {/* ============================
      DATE SELECTION
  ============================ */}
            {selectedServices.length > 0 && (
              <>
                <label>Choose Date</label>
                <input
                  id="calender"
                  type="date"
                  value={selectedDate}
                  min={getTodayDate()}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </>
            )}


            {/* ============================
      TIME SELECTION
  ============================ */}
            {selectedDate && (
              <>
                <label>Choose Time</label>
                <div className="time-grid">
                  {generateTimeSlots().map((time) => {
                    const isBooked = bookedTimes.includes(time);

                    return (
                      <button
                        key={time}
                        disabled={isBooked}
                        className={`time-slot ${selectedTime === time ? "active" : ""}`}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            <hr />


            <p><strong className="cart-text-summary">Total Duration:</strong> {totalDuration} mins</p>
            <p><strong className="cart-text-summary">Total Price:</strong> {totalPrice} RWF</p>
            <p><strong className="cart-text-summary">Total Booking Fee:</strong> {totalBookingFee} RWF</p>
          </>
        )}

        {/* ================================
            PROCEED BUTTON
           ================================ */}
        <button
          onClick={handleProceed}
          disabled={selectedServices.length === 0 || !selectedDate || !selectedTime}
          className="proceed-btn"
        >
          Proceed to Payment
        </button>
      </div>
      </div>
    </div>
  );
};

export default Booking;
