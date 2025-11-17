import React, { useState } from 'react';
import { Plus, Minus, Trash2, ShoppingCart, X } from 'lucide-react';

const OrderSummary = ({ cart, onUpdateQuantity, onRemoveItem, onCheckout, onClose }) => {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const [display, setDisplay] = useState('0');
  const [payment, setPayment] = useState(0);
  const [change, setChange] = useState(0);
  const [orderType, setOrderType] = useState('Dine-in');
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  const handleNumberClick = (num) => {
    if (display === '0') {
      setDisplay(num.toString());
    } else {
      setDisplay(display + num.toString());
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPayment(0);
    setChange(0);
  };

  const handleEnter = () => {
    const paymentAmount = parseFloat(display);
    setPayment(paymentAmount);
    const changeAmount = paymentAmount - total;
    setChange(changeAmount > 0 ? changeAmount : 0);
  };

  const handleClearOrder = () => {
    if (window.confirm('Are you sure you want to clear all items?')) {
      cart.forEach(item => onRemoveItem(item.id));
      handleClear();
    }
  };

  const handleCheckout = () => {
    onCheckout(total, payment, change, orderType, paymentMethod);
    handleClear();
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="order-summary">
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
          <button 
            className={`OTPM-btn ${orderType === 'Dine-in' ? 'active' : ''}`}
            onClick={() => setOrderType('Dine-in')}
          >
            Dine In
          </button>
          <button 
            className={`OTPM-btn ${orderType === 'Takeout' ? 'active' : ''}`}
            onClick={() => setOrderType('Takeout')}
          >
            Takeout
          </button>
        </div>

        <div className="PM-section">
          <button 
            className={`OTPM-btn ${paymentMethod === 'Cash' ? 'active' : ''}`}
            onClick={() => setPaymentMethod('Cash')}
          >
            Cash
          </button>
          <button 
            className={`OTPM-btn ${paymentMethod === 'Gcash' ? 'active' : ''}`}
            onClick={() => setPaymentMethod('Gcash')}
          >
            GCash
          </button>
        </div>
      </div>

      <div className="order-items-section">
        {cart.length === 0 ? (
          <div className="empty-cart-message">Your cart is empty</div>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="order-item">
              <div className="item-info">
                <span className="item-name">{item.item_name}</span>
                <div className="item-controls">
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    className="qty-btn minus"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="qty-btn plus"
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
          ))
        )}
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
            <div className="payment-row change-row">
              <span>Change:</span>
              <span>₱{change.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="number-pad">
        <div className="calculator-grid">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, '.'].map((num, index) => (
            <button 
              key={index}
              className={`calc-btn ${num === 'C' ? 'clear-btn' : ''}`}
              onClick={() => {
                if (num === 'C') {
                  handleClear();
                } else {
                  handleNumberClick(num);
                }
              }}
            >
              {num}
            </button>
          ))}
        </div>
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
          disabled={cart.length === 0}
        >
          CHECKOUT
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;