import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeftRight,
  UtensilsCrossed,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";  
import "../../Style/Sidebar.css";

function StaffSidebar({ name, onLogout, first_name }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const handleLogOut = () => {
    setLoading(true); 
    setTimeout(() => {
      setLoading(false);
      if (onLogout) onLogout();
      navigate("/"); 
    }, 1000);
  };

  const [loginTime, setLoginTime] = useState("");

useState(() => {
  const storedTime = localStorage.getItem("loginTime");
  if (storedTime) {
    const date = new Date(storedTime);
    setLoginTime(date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
  }
}, []);

  return (
    <>
      <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
        <button className="toggle-btn" onClick={toggleSidebar}>
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>

        {!isCollapsed && (
          <div className="nameAndRole">
            <div className="b-border">
              <p>Hi, {first_name}!</p>
              <p>Role: Staff</p>
              <p>Login Time: {loginTime}</p>
            </div>
          </div>
        )}

        <ul>
          <li>
            <Link to="/stafftransactions" title="Transaction History">
              <ArrowLeftRight size={20} className="icon-side" />
              {!isCollapsed && <span>Transaction Today</span>}
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
          <button onClick={handleLogOut} className="log-in-button" title="Logout">
            <LogOut size={20} className="icon-side" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p className="loading-text">Logging out...</p>
        </div>
      )}
      
    </>
  );
}

export default StaffSidebar;
