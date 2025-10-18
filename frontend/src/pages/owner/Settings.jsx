import React from "react";
import { useNavigate } from "react-router-dom";
import "../../Style/Settings.css";

function Settings() {
  const navigate = useNavigate();

  return (
    <div className="settings-container">
      <h2 className="settings-title">Settings</h2>
      <p className="settings-subtitle">Choose an option below</p>

      <div className="settings-options">
        <div
          className="settings-option"
          onClick={() => navigate("/EditAcc")}
        >
          <h3>Edit Account</h3>
          <p>Manage or create user accounts</p>
        </div>

        <div
          className="settings-option"
          onClick={() => navigate("/EditMenu")}
        >
          <h3>Edit Menu</h3>
          <p>Update and organize menu items</p>
        </div>
      </div>
    </div>
  );
}

export default Settings;