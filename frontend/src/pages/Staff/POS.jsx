import React, { useState } from 'react';
import { Plus, Minus, Trash2, ShoppingCart, X, Calculator } from 'lucide-react';

const OrderSummary = ({ cart, onUpdateQuantity, onRemoveItem, onCheckout, onClose }) => {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = total * 0.12; // 12% tax
  const finalTotal = total + tax;
  
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
    const paymentAmount = parseFloat(display) || 0;
    setPayment(paymentAmount);
    const changeAmount = paymentAmount - finalTotal;
    setChange(changeAmount > 0 ? changeAmount : 0);
  };

  const handleClearOrder = () => {
    if (window.confirm('Are you sure you want to clear all items?')) {
      cart.forEach(item => onRemoveItem(item.id));
      handleClear();
    }
  };

  const handleCheckout = () => {
    onCheckout(finalTotal, payment, change, orderType, paymentMethod);
    handleClear();
  };

  return (
    <div className="order-summary">
      {/* Header */}
      <div className="order-summary-header">
        <div>
          <h2 className="order-summary-title">Order Summary</h2>
          <div className="order-summary-subtitle">Table #01 • 2 customers</div>
        </div>
        <button 
          className="close-summary-btn" 
          onClick={onClose}
          aria-label="Close order summary"
        >
          <X size={20} />
        </button>
      </div>

      {/* Order Type & Payment Method */}
      <div className="summary-header">
        <div className="order-type-section">
          <h3 className="section-label">Order Type</h3>
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
        </div>

        <div className="payment-method-section">
          <h3 className="section-label">Payment Method</h3>
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
      </div>

      {/* Order Items */}
      <div className="order-items-section">
        {cart.length === 0 ? (
          <div className="empty-order">
            <div className="empty-icon">
              <ShoppingCart size={48} />
            </div>
            <div className="empty-message">Your cart is empty</div>
            <div className="empty-submessage">Add items from the menu to get started</div>
          </div>
        ) : (
          <>
            <div className="order-items-header">
              <span>Item</span>
              <span>Total</span>
            </div>
            {cart.map((item) => (
              <div key={item.id} className="order-item">
                <div className="item-info">
                  <span className="item-name">{item.item_name}</span>
                  <div className="item-controls">
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="qty-btn minus"
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="qty-btn plus"
                    >
                      <Plus size={14} />
                    </button>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="remove-btn"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="item-total">
                  ₱{(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Totals Section */}
      <div className="order-summary-footer">
        <div className="summary-totals">
          <div className="total-row subtotal">
            <span className="total-label">Subtotal:</span>
            <span className="total-value">₱{total.toFixed(2)}</span>
          </div>
          <div className="total-row">
            <span className="total-label">Tax (12%):</span>
            <span className="total-value">₱{tax.toFixed(2)}</span>
          </div>
          <div className="total-row final-total">
            <span className="total-label">Total Amount:</span>
            <span className="total-value">₱{finalTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Display */}
        <div className="calculator-display">
          <div className="display-amount">
            <span className="display-label">Payment Amount:</span>
            <span>₱{display}</span>
          </div>
          {payment > 0 && (
            <div className="payment-info">
              <div className="payment-row">
                <span>Amount Due:</span>
                <span>₱{finalTotal.toFixed(2)}</span>
              </div>
              <div className="payment-row">
                <span>Amount Paid:</span>
                <span>₱{payment.toFixed(2)}</span>
              </div>
              <div className="payment-row change-row">
                <span>Change:</span>
                <span>₱{change.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Number Pad */}
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
              <Calculator size={18} />
              ENTER PAYMENT
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button 
            className="clear-order-btn"
            onClick={handleClearOrder}
            disabled={cart.length === 0}
          >
            <Trash2 size={18} />
            CLEAR ORDER
          </button>
          <button 
            className="checkout-btn"
            onClick={handleCheckout}
            disabled={cart.length === 0 || payment < finalTotal}
          >
            <ShoppingCart size={18} />
            PROCESS PAYMENT
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;