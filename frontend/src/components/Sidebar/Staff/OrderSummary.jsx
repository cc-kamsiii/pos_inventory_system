import React, { useState } from 'react';
import { Plus, Minus, Trash2, X, ShoppingCart } from 'lucide-react';
import "../../../Style/OrderSummary.css";

const OrderSummary = ({ cart, onUpdateQuantity, onRemoveItem, onCheckout, onClose, isOpen, onToggle }) => {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const [display, setDisplay] = useState('0');
  const [payment, setPayment] = useState(0);
  const [change, setChange] = useState(0);
  const [orderType, setOrderType] = useState('Dine-in');
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  const handleNumberClick = (num) => {
    setDisplay(prev => prev === '0' ? num.toString() : prev + num.toString());
  };

  const handleClear = () => {
    setDisplay('0');
    setPayment(0);
    setChange(0);
  };

  const handleEnter = () => {
    const paymentAmount = parseFloat(display) || 0;
    setPayment(paymentAmount);
    setChange(Math.max(paymentAmount - total, 0));
  };

  const handleClearOrder = () => {
    if (window.confirm('Are you sure you want to clear all items?')) {
      cart.forEach(item => onRemoveItem(item.id));
      handleClear();
    }
  };

  const handleCheckout = () => {
    if (payment < total) {
      alert(`Payment of ₱${payment.toFixed(2)} is insufficient. Total amount is ₱${total.toFixed(2)}. Please enter sufficient payment.`);
      return;
    }

    const confirmed = window.confirm('Are you sure you want to checkout the items?');
    
    if (confirmed) {
      onCheckout(total, payment, change, orderType, paymentMethod);
      handleClear();
    }
  };

  const renderOrderItems = () => {
    if (cart.length === 0) {
      return <div className="empty-cart-message">Your cart is empty</div>;
    }

    return cart.map((item) => (
      <div key={item.id} className="order-item">
        <div className="item-info">
          <span className="item-name">{item.item_name}</span>
          <div className="item-controls">
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              className="qty-btn"
            >
              <Minus size={12} />
            </button>
            <span className="quantity">{item.quantity}</span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="qty-btn"
            >
              <Plus size={12} />
            </button>
            <button
              onClick={() => onRemoveItem(item.id)}
              className="remove-btn"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>
        <div className="item-total">
          ₱{(item.price * item.quantity).toFixed(2)}
        </div>
      </div>
    ));
  };

  const renderNumberPad = () => (
    <div className="calculator-grid">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, '.'].map((num, index) => (
        <button 
          key={index}
          className={`calc-btn ${num === 'C' ? 'clear-btn' : ''}`}
          onClick={() => num === 'C' ? handleClear() : handleNumberClick(num)}
        >
          {num}
        </button>
      ))}
    </div>
  );

  return (
    <>
      <div className={`order-summary ${isOpen ? 'show' : ''}`}>
        <div className="order-summary-content">
          <div className="order-summary-header">
            <div>
              <h2 className="order-summary-title">Order Summary</h2>
              <div className="cart-count">Items in cart: {totalItems}</div>
            </div>
            <button 
              className="close-summary-btn" 
              onClick={onClose}
              aria-label="Close order summary"
            >
              <X size={25} />
            </button>
          </div>

          <div className="summary-header">
            <div className="OT-section">
              {['Dine-in', 'Takeout'].map(type => (
                <button 
                  key={type}
                  className={`OTPM-btn ${orderType === type ? 'active' : ''}`}
                  onClick={() => setOrderType(type)}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="PM-section">
              {['Cash', 'Gcash'].map(method => (
                <button 
                  key={method}
                  className={`OTPM-btn ${paymentMethod === method ? 'active' : ''}`}
                  onClick={() => setPaymentMethod(method)}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          <div className="order-items-section">
            {renderOrderItems()}
          </div>

          <div className="totals-section">
            <div className="total-row final-total">
              <span>Total:</span>
              <span>₱{total.toFixed(2)}</span>
            </div>
          </div>

          <div className="calculator-display">
            <div className="display-amount">
              <span className="display-label">Payment:</span>
              <span>₱{display}</span>
            </div>
            {payment > 0 && (
              <div className="payment-info">
                {payment >= total && (
                  <div className="payment-row change-row">
                    <span>Change:</span>
                    <span>₱{change.toFixed(2)}</span>
                  </div>
                )}
                {payment < total && (
                  <div className="payment-warning">
                    Insufficient Payment! Add ₱{(total - payment).toFixed(2)} ore.
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="number-pad">
            {renderNumberPad()}
            <div className="calculator-actions">
              <button className="calc-action-btn enter" onClick={handleEnter}>
                ENTER
              </button>
            </div>
          </div>

          <div className="action-buttons">
            <button 
              className="clear-order-btn"
              onClick={handleClearOrder}
              disabled={cart.length === 0}
            >
              CLEAR ORDER
            </button>
            <button 
              className="checkout-btn"
              onClick={handleCheckout}
              disabled={cart.length === 0 || payment < total}
            >
              CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderSummary;