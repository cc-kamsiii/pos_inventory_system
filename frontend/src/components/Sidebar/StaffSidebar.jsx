import React from "react";
import { Link } from "react-router-dom";
import "../../Style/Sidebar.css";

function StaffSidebar({ name, onLogout }) {
  return (
    <div className="sidebar">
      <div className="nameAndRole">
        <div className="b-border">
          <p>Role: Staff</p>
          <p>{name}</p>
        </div>
      </div>

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
