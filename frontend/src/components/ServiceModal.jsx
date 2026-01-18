import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { UPLOADS_BASE } from "../api";

const ServiceModal = ({ service, onClose, onAddToCart, cart }) => {
  const navigate = useNavigate();

  const handleBookNow = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    // User not logged in → go to login first
    navigate("/login", {
      state: { redirectTo: "/book", services: [...cart, service] }
    //  navigate("/book", )
    });
  } else {
    // User logged in → go directly to booking
    navigate("/book", { state: { services: [...cart, service] } })
  }
};

  return (
    <div className="modal-overlay">
      <div className="service-modal">
        <img
          src={service.image ? `${UPLOADS_BASE}/uploads/${service.image}` : "../assets/yves-logo.png"}
          alt={service.name}
          loading="lazy"
          decoding="async"
        />
        <div className="modal-content">

        
        <h2>{service.name}</h2>
        <p>{service.description}</p>

        <p className="price"><strong>Total Price:</strong> {service.price} RWF</p>
        <p><strong>Booking Fee:</strong> {service.bookingFee} RWF</p>
        <p><strong>Duration:</strong> {service.duration} mins</p>

        <div className="modal-actions">
          {/* KEEP SELECTING */}
          <button
            className="keep-btn"
            onClick={() => {
              onAddToCart(service);
              onClose();
            }}
          >
            Keep Choosing
          </button>

          {/* BOOK NOW */}
          <button
            className="book-btn"
            onClick={handleBookNow}
          >
            Book Now
          </button>
        </div>
       </div>
        <span className="close-btn" onClick={onClose}><IoMdClose /></span>
      </div>
    </div>
  );
};

export default ServiceModal;
