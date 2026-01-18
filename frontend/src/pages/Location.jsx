import "./Location.css";

/*
  What this component does:
  - Shows banner + contact details
  - Embeds Google Map
  - Adds WhatsApp + Directions + Call links
*/

const Location = () => {
  // ✅ EDIT THESE DETAILS
  const SALON_NAME = "Yves Nail Salon";
  const ADDRESS = "KG 9 Avenue, Kigali, Rwanda";
  const PHONE_DISPLAY = "+250 798 600 430";
  const PHONE_RAW = "250798600430"; // No +, no spaces
  const EMAIL = "yvesnailsalon@gmail.com";
  const HOURS = "Mon – Sat: 8:00 AM – 7:00 PM";

  // WhatsApp link (opens chat)
  const WHATSAPP_LINK = `https://wa.me/${PHONE_RAW}?text=${encodeURIComponent(
    "Hello Yves Nail Salon I want to book an appointment."
  )}`;

  // Google Maps directions link
  const DIRECTIONS_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    ADDRESS
  )}`;

  // ✅ Replace with your real Google Maps embed link:
  // Google Maps -> Share -> Embed a map -> copy iframe src
  const MAP_EMBED_URL =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d384.86165873245426!2d30.1030904!3d-1.9515002000000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca6faf7b9dd2d%3A0x277bb8c70889cd06!2sNew%20Kebuka%20Salon!5e1!3m2!1sen!2srw!4v1768334883015!5m2!1sen!2srw";

  return (
    <div className="loc-page">
      {/* Banner */}
      <section className="loc-hero">
        <div className="loc-hero-inner">
          <h1>Location</h1>
          <p>
            Visit <strong>{SALON_NAME}</strong> — we’re ready to welcome you 
          </p>

          <div className="loc-actions">
            <a className="btn btn-white" href={DIRECTIONS_LINK} target="_blank" rel="noreferrer">
              Get Directions
            </a>

            <a className="btn btn-outline" href={WHATSAPP_LINK} target="_blank" rel="noreferrer">
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="loc-content">
        {/* Map card */}
        <div className="card map-card">
          <div className="card-header">
            <h3>Find us on the map</h3>
            <p className="muted">{ADDRESS}</p>
          </div>

          <div className="map-wrap">
            <iframe
              title="Yves Nail Salon Map"
              src={MAP_EMBED_URL}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>

        {/* Contact card */}
        <div className="card info-card">
          <h3>Contact Details</h3>

          <div className="info-grid">
            <div className="info-item">
              <span className="label">Salon</span>
              <span className="value">{SALON_NAME}</span>
            </div>

            <div className="info-item">
              <span className="label">Address</span>
              <span className="value">{ADDRESS}</span>
            </div>

            <div className="info-item">
              <span className="label">Phone</span>
              <a className="value link" href={`tel:+${PHONE_RAW}`}>
                {PHONE_DISPLAY}
              </a>
            </div>

            <div className="info-item">
              <span className="label">WhatsApp</span>
              <a className="value link" href={WHATSAPP_LINK} target="_blank" rel="noreferrer">
                Chat on WhatsApp
              </a>
            </div>

            <div className="info-item">
              <span className="label">Email</span>
              <a className="value link" href={`mailto:${EMAIL}`}>
                {EMAIL}
              </a>
            </div>

            <div className="info-item">
              <span className="label">Working Hours</span>
              <span className="value">{HOURS}</span>
            </div>
          </div>

          <div className="info-actions">
            <a className="btn btn-pink" href={WHATSAPP_LINK} target="_blank" rel="noreferrer">
              Book via WhatsApp
            </a>

            <a className="btn btn-light" href={DIRECTIONS_LINK} target="_blank" rel="noreferrer">
              Open Google Maps
            </a>
          </div>
        </div>
      </section>

      {/* Floating WhatsApp button */}
      <a className="wa-float" href={WHATSAPP_LINK} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">
        WhatsApp
      </a>
    </div>
  );
};

export default Location;
