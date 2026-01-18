// StatCard.jsx
// Small reusable card for dashboard statistics.

import "./StatCard.css";

const StatCard = ({ title, value, subtitle }) => {
  return (
    <div className="stat-card">
      <p className="stat-title">{title}</p>
      <h2 className="stat-value">{value}</h2>
      {subtitle && <p className="stat-sub">{subtitle}</p>}
    </div>
  );
};

export default StatCard;
