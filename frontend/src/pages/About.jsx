import { useState } from "react";
import "./About.css";

/*
  What this component does:
  - About section (brand story)
  - FAQ accordion
  - Terms & Conditions section (includes booking fee policy)
*/

const FAQItem = ({ q, a, open, onToggle }) => {
  return (
    <div className={`faq-item ${open ? "open" : ""}`}>
      <button
        className="faq-q"
        onClick={onToggle}
        type="button"
        aria-expanded={open}
      >
        <span>{q}</span>
        <span className="faq-icon">{open ? "–" : "+"}</span>
      </button>

      {open && <div className="faq-a">{a}</div>}
    </div>
  );
};

const About = () => {
  const [openIndex, setOpenIndex] = useState(0);

  // ✅ Edit these details anytime
  const salon = {
    name: "Yves Nail Salon",
    location: "Kigali, Rwanda",
    mission:
      "To make every client feel confident with clean, beautiful, long-lasting nail styling.",
    story:
      "We’re a modern nail studio focused on hygiene, quality products, and the best client experience. From classic manicures to deluxe sets, we deliver consistent results — every time.",
    values: [
      { title: "Hygiene First", text: "Clean tools, clean station, clean results." },
      { title: "Quality Products", text: "We use safe, trusted, long-lasting products." },
      { title: "Respect Your Time", text: "Clear booking, clear timing, easy reschedule." }
    ],
  };

  const faqs = [
    {
      q: "Do I need an appointment or can I walk in?",
      a: "Appointments are recommended to guarantee your slot. Walk-ins are welcome if we have availability.",
    },
    {
      q: "How long does a service take?",
      a: "It depends on the service. Most treatments take 30–90 minutes. Duration is shown on each service before booking.",
    },
    {
      q: "What is the booking fee?",
      a: "The booking fee confirms your reservation and helps us keep your time slot secure.",
    },
    {
      q: "Is the booking fee refundable?",
      a: "If you cancel at least 4 hours before your appointment, we can reschedule or handle it based on the policy shown in Terms & Conditions on this page.",
    },
    {
      q: "Can I change my booking after payment?",
      a: "Yes. Contact us (WhatsApp is fastest). We can reschedule based on availability.",
    },
    {
      q: "What if I’m late?",
      a: "If you arrive late, we may shorten the service to respect other bookings, or we may reschedule depending on availability.",
    },
  ];

  return (
    <div className="about-page">
      {/* HERO */}
      <section className="about-hero">
        <div className="about-hero-inner">
          <h1>About {salon.name}</h1>
          <p>
            Premium nail styling with hygiene, comfort and quality — in{" "}
            <strong>{salon.location}</strong>.
          </p>
        </div>
      </section>

      {/* MAIN GRID */}
      <section className="about-content">
        {/* LEFT COLUMN */}
        <div className="stack">
          {/* ABOUT CARD */}
          <div className="card">
            <h2>Who we are</h2>
            <p className="muted">{salon.story}</p>

            <div className="about-split">
              <div className="about-block">
                <h3>Our Mission</h3>
                <p>{salon.mission}</p>
              </div>

              <div className="about-block">
                <h3>Our Values</h3>
                <div className="values">
                  {salon.values.map((v, idx) => (
                    <div className="value" key={idx}>
                      <div className="value-dot" />
                      <div>
                        <strong>{v.title}</strong>
                        <p className="muted" style={{ marginTop: 4 }}>{v.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="stats">
              <div className="stat">
                <span className="stat-num">Clean</span>
                <span className="stat-label">Tools & Space</span>
              </div>
              <div className="stat">
                <span className="stat-num">Fast</span>
                <span className="stat-label">Easy Booking</span>
              </div>
              <div className="stat">
                <span className="stat-num">Pro</span>
                <span className="stat-label">Expert Styling</span>
              </div>
            </div>
          </div>

          {/* TERMS CARD */}
          <div className="card">
            <div className="card-head">
              <h2>Terms & Conditions</h2>
              <span className="pill">Booking Policy</span>
            </div>

            <div className="terms">
              <div className="term">
                <h4>1) Booking Fee Policy</h4>
                <p>
                  The booking fee reserves your slot and helps us prepare for your service.
                  <strong> Booking fee is non-refundable</strong> if you cancel
                  <strong> less than 4 hours</strong> before your appointment time.
                </p>
                <p className="muted">
                  If you cancel at least 4 hours before, we can reschedule your booking
                  (subject to availability) or handle it according to the salon’s policy.
                </p>
              </div>

              <div className="term">
                <h4>2) Rescheduling</h4>
                <p>
                  You may request a reschedule before your appointment. We’ll offer the next available slots.
                  Last-minute changes may be limited.
                </p>
              </div>

              <div className="term">
                <h4>3) Late Arrival</h4>
                <p>
                  If you arrive late, we may shorten the service or reschedule, depending on time and availability,
                  to respect other clients.
                </p>
              </div>

              <div className="term">
                <h4>4) No-Show</h4>
                <p>
                  If you do not show up without notice, the booking fee is kept and a new booking fee may be required
                  to reserve another slot.
                </p>
              </div>

              <div className="term">
                <h4>5) Prices & Service Changes</h4>
                <p>
                  Prices, durations, and service availability can change. Your confirmed booking is based on the
                  details shown at the time you book.
                </p>
              </div>

              <div className="term">
                <h4>6) Contact & Support</h4>
                <p>
                  If you have questions about your booking, contact us via WhatsApp or phone (see Location page).
                </p>
              </div>

              <div className="terms-note">
                By booking a service, you agree to these terms.
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="card">
          <h2>FAQ</h2>
          <p className="muted">Quick answers before you book.</p>

          <div className="faq-list">
            {faqs.map((item, idx) => (
              <FAQItem
                key={idx}
                q={item.q}
                a={item.a}
                open={openIndex === idx}
                onToggle={() => setOpenIndex(openIndex === idx ? -1 : idx)}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
