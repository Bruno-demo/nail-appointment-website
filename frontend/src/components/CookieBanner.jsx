import { useEffect, useState } from "react";
import "./CookieBanner.css";

const COOKIE_NAME = "cookie_consent";
const COOKIE_DAYS = 180;

const getCookie = (name) => {
  const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
  const match = cookies.find((cookie) => cookie.startsWith(`${name}=`));
  return match ? match.split("=")[1] : "";
};

const setCookie = (name, value, days) => {
  const maxAge = days * 24 * 60 * 60;
  const secure = window.location.protocol === "https:" ? "; secure" : "";
  document.cookie = `${name}=${value}; max-age=${maxAge}; path=/; samesite=lax${secure}`;
};

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = getCookie(COOKIE_NAME);
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleChoice = (value) => {
    setCookie(COOKIE_NAME, value, COOKIE_DAYS);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-live="polite">
      <div className="cookie-card">
        <div className="cookie-text">
          <span className="cookie-kicker">Cookie notice</span>
          <h3>We use cookies</h3>
          <p>
            We use cookies to improve your experience, remember preferences, and
            help the site run smoothly.
          </p>
        </div>
        <div className="cookie-actions">
          <button
            type="button"
            className="cookie-btn ghost"
            onClick={() => handleChoice("declined")}
          >
            Decline
          </button>
          <button
            type="button"
            className="cookie-btn primary"
            onClick={() => handleChoice("accepted")}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
