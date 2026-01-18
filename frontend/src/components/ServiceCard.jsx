import { UPLOADS_BASE } from "../api";

const ServiceCard = ({ service, onSelect }) => {
  return (
    
    <div className="service-card">
      <img
        src={`${UPLOADS_BASE}/uploads/${service.image}`}
        alt={service.name}
        loading="lazy"
        decoding="async"
      />


      <h4 className="service-info-h4">{service.name}</h4>
      <p className="service-info-p">Total Price: {service.price} RWF</p>
      <p className="service-info-p">Booking Fee: {service.bookingFee} RWF</p>
      <p className="service-info-p">Duration: {service.duration} mins</p>

      <button onClick={onSelect}>Select</button>
    </div>
  );
};

export default ServiceCard;
