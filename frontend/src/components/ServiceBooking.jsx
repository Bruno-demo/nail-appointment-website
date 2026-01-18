import { useState } from "react";
import { bookAppointment } from "../api/appointments";

const ServiceBooking = ({ service }) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBook = async () => {

    const token = localStorage.getItem("token");
    if (!token) {
    alert("Please login first to book an appointment");
    return;
    
    }
    if (!date || !time) {
      alert("Please select date and time");
      return;
    }

    try {
      setLoading(true);

      const data = {
        service: service._id,
        date,
        time,
      };

      await bookAppointment(data);
      alert("Appointment booked successfully! 💅");

      setDate("");
      setTime("");
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: "1px solid #ddd", padding: "15px", borderRadius: "8px", marginBottom: "15px" }}>
      <h3>{service.name}</h3>
      <p>💵 {service.price} RWF</p>
      <p>⏱ {service.duration} minutes</p>

      <div style={{ marginTop: "10px" }}>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          style={{ marginLeft: "10px" }}
        />

        <button
          onClick={handleBook}
          disabled={loading}
          style={{ marginLeft: "10px" }}
        >
          {loading ? "Booking..." : "Book"}
        </button>
      </div>
    </div>
  );
};

export default ServiceBooking;
