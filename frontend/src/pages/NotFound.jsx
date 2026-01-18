import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  return (
    <div className="notfound-page">
      <div className="notfound-card">
        <span className="notfound-kicker">Page not found</span>
        <h1>We could not find that page.</h1>
        <p>Check the link or use the buttons below to keep browsing.</p>
        <div className="notfound-actions">
          <Link to="/" className="notfound-btn primary">
            Back Home
          </Link>
          <Link to="/services" className="notfound-btn ghost">
            Browse Services
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
