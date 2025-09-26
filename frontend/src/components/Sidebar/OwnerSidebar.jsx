import React from "react";
import { LayoutDashboard, ArrowLeftRight, Box, Settings } from "lucide-react"; 
import { Link } from "react-router-dom";
import "../../Style/Sidebar.css";

function OwnerSidebar({ name, onLogout }) {
  return (
    <div className="sidebar">


      {/* 
      <p style={{ fontSize: "14px", color: "lightgray" }}>Name: {name}</p>
      <p style={{ fontSize: "12px", color: "lightgray" }}>Role: Owner</p>*/
      }

      <div className="nameAndRole">
        <div className="b-border">
          <p>Role: Owner</p>
          <p>{name}</p>
        </div>
      </div>

      <ul>
        <li>
          <Link to="/dashboard">
            <LayoutDashboard size={20} className="icon-side"  />
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/ownertransactions">
            <ArrowLeftRight size={20} className="icon-side" />
            Transaction (History)
          </Link>
        </li>
        <li>
          <Link to="/inventory">
            <Box size={20} className="icon-side"  />
             Inventory
          </Link>
        </li>
        <li>
          <Link to="/settings">
            <Settings size={20} className="icon-side" />
             Settings
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

export default OwnerSidebar;
