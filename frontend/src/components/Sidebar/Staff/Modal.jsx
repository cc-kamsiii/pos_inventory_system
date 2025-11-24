import React from "react";
import "../../../Style/Modal.css";

const Modal = ({ isVisible, onClose, lastTransaction }) => {
  if (!isVisible) return null;

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-body">
          <h3 className="success-title">Payment Successful!</h3>
          <p className="success-date">
            {currentDate}
          </p>
          <p className="success-amount">
            Total:{" "}
            <span className="amount">
              ₱{lastTransaction.total_payment?.toFixed(2)}
            </span>
          </p>
          <button onClick={onClose} className="continue-btn">
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;