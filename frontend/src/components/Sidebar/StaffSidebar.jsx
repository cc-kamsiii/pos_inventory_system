import React from "react";
import { Link } from "react-router-dom";
import { LayoutDashboard, ArrowLeftRight, Box, UtensilsCrossed } from "lucide-react"; 
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
        <li>
          <Link to="/dashboard">
            <LayoutDashboard size={20} className="icon-side" />
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/stafftransactions">
            <ArrowLeftRight size={20} className="icon-side" />
            Transaction (History)
          </Link>
        </li>
        <li>
          <Link to="/pos">
            < UtensilsCrossed size={20} className="icon-side" />
             POS
          </Link>
        </li>
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
