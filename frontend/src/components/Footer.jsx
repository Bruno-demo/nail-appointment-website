// What this does:
// Reusable Footer component that appears on every page.

import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import { FaInstagram, FaWhatsapp, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* Left: Brand */}
        <div className="footer-col">
          <h3 className="footer-title">Yves Nail Salon</h3>
          <p className="footer-text">
            Beautiful nails, clean service, and a smooth booking experience.
          </p>

          <div className="footer-socials">
            <a
              href="https://www.instagram.com/_yvesnails_art_rwanda"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="footer-social"
            >
              <FaInstagram />
            </a>

            <a
              href="https://wa.me/250798600430"
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="footer-social"
            >
              <FaWhatsapp />
            </a>
          </div>
        </div>

        {/* Middle: Links */}
        <div className="footer-col">
          <h4 className="footer-subtitle">Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/collections">Collections</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/location">Location</Link></li>
          </ul>
        </div>

        {/* Right: Contact */}
        <div className="footer-col">
          <h4 className="footer-subtitle">Contact</h4>

          <div className="footer-contact">
            <p>
              <FaPhoneAlt className="footer-icon" />
              <a href="tel:+250798600430">+250 798 600 430</a>
            </p>

            <p>
              <FaEnvelope className="footer-icon" />
              <a href="mailto:info@yvesnailsalon.com">info@yvesnailsalon.com</a>
            </p>

            <p className="footer-muted">
              Kigali, Rwanda • Open: 8:00 AM – 7:00 PM
            </p>
          </div>

          <Link to="/book" className="footer-cta">
            Book an Appointment
          </Link>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {year} Yves Nail Salon. All rights reserved.</p>
        <div className="footer-bottom-links">
          <Link to="/about#terms">Terms</Link>
          <span className="dot">•</span>
          <Link to="/about#faq">FAQ</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
