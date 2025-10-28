import React from "react";
import exclamation from "../assets/exclamation.png";
import "../Style/NotLoggedIn.css";

const UserNotLoggedIn = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-body">
          <img src={exclamation} alt="Logo" className="exclamation" />
          <h3 className="user-not-found">User not found</h3>
          <button onClick={onClose} className="close-not-found">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserNotLoggedIn;
