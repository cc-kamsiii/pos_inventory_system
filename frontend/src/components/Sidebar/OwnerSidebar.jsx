  import React, { useState } from "react";
  import {
    LayoutDashboard,
    ArrowLeftRight,
    Box,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
  } from "lucide-react";
  import { Link } from "react-router-dom";
  import "../../Style/Sidebar.css";

  function OwnerSidebar({ name, onLogout }) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);

    return (
      <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
        <button className="toggle-btn" onClick={toggleSidebar}>
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>

        {!isCollapsed && (
          <div className="nameAndRole">
            <div className="b-border">
              <p>Role: Owner</p>
              <p>{name}</p>
            </div>
          </div>
        )}

        <ul>
          <li>
            <Link to="/dashboard" title="Dashboard">
              <LayoutDashboard size={20} className="icon-side" />
              {!isCollapsed && <span>Dashboard</span>}
            </Link>
          </li>

          <li>
            <Link to="/ownertransactions" title="Transaction History">
              <ArrowLeftRight size={20} className="icon-side" />
              {!isCollapsed && <span>Transaction History</span>}
            </Link>
          </li>

          <li>
            <Link to="/inventory" title="Inventory">
              <Box size={20} className="icon-side" />
              {!isCollapsed && <span>Inventory</span>}
            </Link>
          </li>

          <li>
            <Link to="/settings" title="Settings">
              <Settings size={20} className="icon-side" />
              {!isCollapsed && <span>Settings</span>}
            </Link>
          </li>
        </ul>

        <div className="bottom-log-out">
          <button onClick={onLogout} className="log-in-button" title="Logout">
            <LogOut size={20} className="icon-side" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    );
  }

  export default OwnerSidebar;
