import React, { useState } from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';

const OrderSummary = ({ cart, onUpdateQuantity, onRemoveItem, onCheckout }) => {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const [display, setDisplay] = useState('0');
  const [payment, setPayment] = useState(0);
  const [change, setChange] = useState(0);
  const [orderType, setOrderType] = useState('dine-in');
  const [paymentMethod, setPaymentMethod] = useState('cash');

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

  return (
    <div className="order-summary">
      <div className="summary-header">
        <h2>Order Summary</h2>
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
        {cart.map((item) => (
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
        ))}
      </div>

      <div className="calculator-display">
        <div className="display-amount">₱{display}</div>
        {payment > 0 && (
          <div className="payment-info">
            <div>Payment: ₱{payment.toFixed(2)}</div>
            <div>Change: ₱{change.toFixed(2)}</div>
          </div>
        )}
      </div>

      <div className="totals-section">
        <div className="total-row final-total">
          <span>Total:</span>
          <span>₱{total.toFixed(2)}</span>
        </div>
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
      
      <button 
        className="checkout-btn"
        onClick={() => onCheckout(total, payment, change, orderType, paymentMethod)}
        disabled={cart.length === 0}
      >
        CHECKOUT
      </button>
    </div>
  );
};

export default OrderSummary;