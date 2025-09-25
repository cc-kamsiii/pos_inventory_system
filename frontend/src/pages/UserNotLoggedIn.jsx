import React from 'react';

const UserNotLoggedIn = ({ isVisible, onClose}) => {
  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-body">
          <h3 className="success-title">User not found</h3>
          <button onClick={onClose} style={{color:"white", backgroundColor:"red", border:"none", padding: "0.75rem 2rem", borderRadius: "6px", cursor:"pointer", fontWeight:"500"}}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserNotLoggedIn;