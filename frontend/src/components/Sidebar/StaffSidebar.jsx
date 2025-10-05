import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeftRight, UtensilsCrossed, LogOut, ChevronLeft, ChevronRight } from "lucide-react"; 
import "../../Style/Sidebar.css";

function StaffSidebar({ name, onLogout }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <button className="toggle-btn" onClick={toggleSidebar}>
        {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>

      {!isCollapsed && (
        <div className="nameAndRole">
          <div className="b-border">
            <p>Role: Staff</p>
            <p>{name}</p>
          </div>
        </div>
      )}

      <ul>
        <li>
          <Link to="/stafftransactions" title="Transaction History">
            <ArrowLeftRight size={20} className="icon-side" />
            {!isCollapsed && <span>Transaction History</span>}
          </Link>
        </li>
        <li>
          <Link to="/pos" title="POS">
            <UtensilsCrossed size={20} className="icon-side" />
            {!isCollapsed && <span>POS</span>}
          </Link>
        </li>
      </ul>

      <div className="bottom-log-out">
        <button onClick={onLogout} className="log-in-button" title="Logout">
          <LogOut size={20} className="icon-side"/>
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}

export default StaffSidebar;