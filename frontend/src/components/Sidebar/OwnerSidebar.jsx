import React from "react";
import { Link } from "react-router-dom";
import "../../Style/Sidebar.css";

function OwnerSidebar({ name, onLogout }) {
  return (
    <div className="sidebar">
      <h2>POS System</h2>
      <p style={{ fontSize: "14px", color: "lightgray" }}>Name: {name}</p>
      <p style={{ fontSize: "12px", color: "lightgray" }}>Role: Owner</p>

      <ul>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/transaction">Transactions (History)</Link></li>
        <li><Link to="/inventory">Inventory</Link></li>
        <li><Link to="/settings">Settings</Link></li>
      </ul>

      <div className="bottom-log-out">
        <button onClick={onLogout} className="log-in-button">
          Logout
        </button>
      </div>
    </div>
  );
}

export default OwnerSidebar;
