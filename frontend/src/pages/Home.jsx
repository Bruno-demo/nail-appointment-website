import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "./Home.css";
import heroOne from "../assets/hero1.jpg";
import heroTwo from "../assets/banner1.jpg";
import clientOne from "../assets/funny1.jpg";
import clientTwo from "../assets/funny2.jpg";
import clientThree from "../assets/funny3.jpg";
import serviceOne from "../assets/1694.jpg";
import serviceTwo from "../assets/collection.jfif";
import serviceThree from "../assets/location.jpg";
import whyImage from "../assets/about-us-page.png";

const Home = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const totalSlides = 2;

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % totalSlides);
    }, 8000);

    return () => clearInterval(interval);
  }, [totalSlides]);

  const goPrev = () => {
    setActiveSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goNext = () => {
    setActiveSlide((prev) => (prev + 1) % totalSlides);
  };

  return (
    <main className="home-page">
      <section className="home-hero home-section">
        <div className="home-wrap">
          <div className="hero-slider">
            <div
              className="hero-track"
              style={{ transform: `translateX(-${activeSlide * 100}%)` }}
            >
              <article className="hero-slide">
                <img
                  src={heroOne}
                  alt="Nail studio interior"
                  loading="eager"
                  decoding="async"
                  fetchpriority="high"
                />
                <div className="hero-overlay" />
                <div className="hero-content">
                  <span className="hero-kicker">Nail Studio</span>
                  <h1>Yves Nail Salon</h1>
                  <p>
                    Skilled technicians • Clean tools • Beautiful results every visit.
                  </p>
                  <div className="hero-actions">
                    <Link to="/services" className="home-btn primary">
                      Choose Service
                    </Link>
                  </div>
                </div>
              </article>

              <article className="hero-slide">
                <img
                  src={heroTwo}
                  alt="Nail art collection"
                  loading="eager"
                  decoding="async"
                  fetchpriority="high"
                />
                <div className="hero-overlay alt" />
                <div className="hero-content">
                  <span className="hero-kicker">Signature Treatments</span>
                  <h1>Good services we provide.</h1>
                  <p>
                    For weddings, photoshoots, and parties polished nails to match your outfit.
                  </p>
                  <p className="hero-note">
                    Book now for a polished look and a relaxing experience.
                  </p>
                  <div className="hero-actions">
                    <Link to="/book" className="home-btn primary">
                      Book Now
                    </Link>
                  </div>
                </div>
              </article>
            </div>
            <button
              type="button"
              className="hero-nav prev"
              onClick={goPrev}
              aria-label="Previous slide"
            >
              <FiChevronLeft aria-hidden="true" />
            </button>
            <button
              type="button"
              className="hero-nav next"
              onClick={goNext}
              aria-label="Next slide"
            >
              <FiChevronRight aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      <section className="home-section trust-section">
        <div className="home-wrap trust-grid">
          <div className="trust-card">
            <div className="avatar-stack">
              <img src={clientOne} alt="Happy client" loading="lazy" decoding="async" />
              <img src={clientTwo} alt="Happy client" loading="lazy" decoding="async" />
              <img src={clientThree} alt="Happy client" loading="lazy" decoding="async" />
            </div>
            <div className="trust-copy">
              <h3>150+ happy clients who trust us</h3>
              <p>
                At Yves Nail Salon, every appointment is more than a service it’s 
                your time to reset, feel confident, and leave with nails you genuinely 
                love.
              </p>
            </div>
          </div>

          <div className="trust-card accent">
            <span className="trust-kicker">2+ years of experience</span>
            <h3>Refined techniques, calm appointments</h3>
            <p>
              Award-winning nail artistry, top-rated reviews, a professional studio experience, and RDB registration you can trust.
            </p>
            <div className="trust-stats">
              <div>
                <span className="stat-number">4.9</span>
                <span className="stat-label">Average rating</span>
              </div>
              <div>
                <span className="stat-number">120+</span>
                <span className="stat-label">Monthly visits</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section feature-section">
        <div className="home-wrap">
          <div className="section-head">
            <span className="section-kicker">Signature Services</span>
            <h2>Detailed care with a luxury finish.</h2>
            <p>
              Detailed hand care with a luxury finish clean cuticles,
               perfect shaping, and a polished look that lasts.
            </p>
          </div>

          <div className="feature-rows">
            <article className="feature-row">
              <div className="feature-media">
                <img src={serviceOne} alt="Luxury manicure service" loading="lazy" decoding="async" />
              </div>
              <div className="feature-body">
                <h3>Luxury manicure ritual</h3>
                <p>
                  A full hand-care experience that starts with gentle cleansing and nail shaping,
                   followed by detailed cuticle work and a smoothing exfoliation.
                </p>
                <div className="feature-actions">
                  <Link to="/book" className="home-btn primary">
                    Book Appointment
                  </Link>
                  <Link to="/location" className="home-btn ghost">
                    Contact Me
                  </Link>
                </div>
              </div>
            </article>

            <article className="feature-row reverse">
              <div className="feature-media">
                <img src={serviceTwo} alt="Premium nail care" loading="lazy" decoding="async" />
              </div>
              <div className="feature-body">
                <h3>Artful extensions & polish</h3>
                <p>
                  Get a look that instantly upgrades your style clean, elegant, or bold.
                   We customize the length, shape, and design to match your vibe.
                </p>
                <div className="feature-actions">
                  <Link to="/services" className="home-btn primary">
                    Explore My Service
                  </Link>
                </div>
              </div>
            </article>

            <article className="feature-row">
              <div className="feature-media">
                <img src={serviceThree} alt="Nail care studio" loading="lazy" decoding="async" />
              </div>
              <div className="feature-body">
                <h3>Relaxed studio appointments</h3>
                <p>
                  Visit us in Remera — KG 220 St (near RDB). We’re open Monday Saturday 
                  from 8:00 AM to 7:00 PM. Guests love visiting because they get a truly 
                  professional experience with clean, polished results every time.

                </p>
                <div className="feature-actions">
                  <Link to="/location" className="home-btn primary">
                    Find Us on Map
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="home-section why-section">
        <div className="home-wrap why-grid">
          <div className="why-card">
            <img src={whyImage} alt="Nail artist portrait" loading="lazy" decoding="async" />
          </div>
          <div className="why-content">
            <span className="section-kicker">Why Me</span>
            <h2>Care you can feel, details you can see.</h2>
            <p>
              Tell guests what makes Yves Nail Salon different clean tools,
              careful technique, and results that last
            </p>
            <ul className="why-list">
              <li>Personalized service and calm appointments</li>
              <li>Premium tools, clean techniques, lasting wear</li>
              <li>Style guidance for every season and mood</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="home-wrap">
          <div className="cta-banner">
            <h2>Get nails that feel cared for and look flawless.</h2>
            <p>
              Book your next visit today enjoy great care, clean service, 
              and attention to every detail.
            </p>
            <Link to="/book" className="home-btn light">
              Book Appointment
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
