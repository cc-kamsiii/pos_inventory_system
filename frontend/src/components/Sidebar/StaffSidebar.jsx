import React from "react";
import { Link } from "react-router-dom";
import "../../Style/Sidebar.css";

function StaffSidebar({ name, onLogout }) {
  return (
    <div className="sidebar">
      <h2>POS System</h2>
      <p style={{ fontSize: "14px", color: "lightgray" }}>Name: {name}</p>
      <p style={{ fontSize: "12px", color: "gray" }}>Role: Staff</p>

      <ul>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/transaction-today">Transactions (Today)</Link></li>
        <li><Link to="/pos">POS</Link></li>
      </ul>

      <div className="bottom-log-out">
        <button onClick={onLogout} className="log-in-button">
          Logout
        </button>
      </div>
    </div>
  );
}

export default StaffSidebar;
