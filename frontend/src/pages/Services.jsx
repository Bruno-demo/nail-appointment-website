import { useEffect, useState } from "react";
import API from "../api";
import ServiceCard from "../components/ServiceCard";
import ServiceModal from "../components/ServiceModal";
import "./Services.css";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


const Services = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    if (!savedCart) return [];
    try {
      return JSON.parse(savedCart);
    } catch {
      return [];
    }
  });
  const [showCartModal, setShowCartModal] = useState(false);
  const [activeService, setActiveService] = useState(null);
  const navigate = useNavigate();

  // Fetch services from backend
  useEffect(() => {
    API
      .get("/services")
      .then((res) => setServices(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);


  // Add service to cart
  const addToCart = (service) => {
    setCart((prevCart) => {
      // Check if service already exists
      const exists = prevCart.find((item) => item._id === service._id);

      if (exists) {
        return prevCart; // don't add duplicate
      }
      const updatedCart = [...prevCart, service];
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };


  return (
    <div className="services-page">
      {/* ===== BANNER ===== */}
      <div className="services-banner">
        <h1>Our Services</h1>
        <p>Select your service and book instantly</p>
      </div>

      {/* ===== CART PREVIEW ===== */}
      <div className="cart-preview-bar">
        <div className="cart-left">
          {cart.length === 0 ? (
            <span className="empty-text">No service selected at this time</span>
          ) : (
            <div className="selected-services">
              {cart.map((s) => (
                <span
                  key={s._id}
                  className="service-chip"
                  onClick={() => {
                    setActiveService(s);
                    setShowCartModal(true);
                    console.log("Active service:", activeService);
                  }}
                >
                  {s.name}
                </span>
              ))}
            </div>
          )}
        </div>

        <div
          className="cart-icon"
          onClick={() => setShowCartModal(true)}
        >
          <FaShoppingCart />
          {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
        </div>
      </div>


      {/* ===== SERVICES LIST ===== */}
      <div className="services-grid">
        {services.map((service) => (
          <ServiceCard
            key={service._id}
            service={service}
            onSelect={() => setSelectedService(service)}
          />
        ))}
      </div>

      {/* ===== MODAL ===== */}
      {selectedService && (
        <ServiceModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
          onAddToCart={addToCart}
          cart={cart}
        />
      )}
      {showCartModal && (
        <div className="cart-modal-overlay" onClick={() => setShowCartModal(false)}>
          <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="head-text">Selected Services</h3>

            {cart.length === 0 ? (
              <p className="text-muted">No services selected.</p>
            ) : (
              cart.map((s) => (
                <div key={s._id} className="cart-item">
                  <div>
                    <strong>{s.name}</strong>
                    <p>Booking Fee: {s.bookingFee} RWF</p>
                  </div>
                  <button onClick={() => removeFromCart(s._id)}>✖</button>
                </div>
              ))
            )}

            <button
              className="close-btn-cart"
              onClick={() => {
                if (cart.length > 0) {
                  navigate("/book", { state: { services: cart } });
                } else {
                  setShowCartModal(false);
                }
              }}
            >
              {cart.length > 0 ? "Book Now" : "Close"}
            </button>

          </div>
        </div>
      )}

    </div>
  );
};

export default Services;
