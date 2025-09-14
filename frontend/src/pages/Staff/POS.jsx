import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, Search, RefreshCw } from 'lucide-react';
import "../../Style/POS.css";

// Menu
const Menu = ({ products, onAddToCart, selectedCategory }) => {
  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="menu-section">
      <div className="menu-header">
        <div className="search-bar">
          <Search className="search-icon" />
          <input type="text" placeholder="Search Menu" className="search-input" />
        </div>
        <button className="refresh-btn">
          <RefreshCw className="refresh-icon" />
          Refresh
        </button>
      </div>
      
      <div className="products-grid">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <span className="product-emoji">{product.emoji}</span>
              <button className="available-badge">Available</button>
            </div>
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">₱{product.price.toFixed(2)}</p>
              <button 
                className="add-to-cart-btn"
                onClick={() => onAddToCart(product)}
              >
                <Plus className="plus-icon" />
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Categories
const Categories = ({ categories, selectedCategory, onCategorySelect }) => {
  return (
    <div className="categories-bar">
      {categories.map((category) => (
        <button
          key={category.name}
          className={`category-btn ${selectedCategory === category.name ? 'active' : ''}`}
          onClick={() => onCategorySelect(category.name)}
        >
          {category.name}
          <span className="category-count">{category.count}</span>
        </button>
      ))}
    </div>
  );
};

// Order Summary
const OrderSummary = ({ cart, onUpdateQuantity, onRemoveItem, onCheckout }) => {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="order-summary">
      <div className="summary-header">
        <h2>Order Summary</h2>
      </div>

      <div className="order-items">
        {cart.map((item) => (
          <div key={item.id} className="order-item">
            <div className="item-image">
              <span className="item-emoji">{item.emoji}</span>
            </div>
            <div className="item-details">
              <h4 className="item-name">{item.name}</h4>
              <div className="item-controls">
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  className="quantity-btn"
                >
                  <Minus className="btn-icon" />
                </button>
                <span className="quantity">{item.quantity}</span>
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  className="quantity-btn"
                >
                  <Plus className="btn-icon" />
                </button>
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="remove-item-btn"
                >
                  <Trash2 className="btn-icon" />
                </button>
              </div>
            </div>
            <div className="item-price">
              ₱{(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      <div className="order-total">
        <h3>Total Payment: ₱{total.toFixed(2)}</h3>
      </div>

      <button className="confirm-payment-btn" onClick={() => onCheckout(total)}>
        Confirm Payment
      </button>
    </div>
  );
};


//POS
function POS() {
  const [categories] = useState([
    { name: 'All', count: 43 },
    { name: 'Beverages', count: 11 },
    { name: 'Main Course', count: 16 },
    { name: 'Dessert', count: 8 },
    { name: 'Appetizer', count: 8 }
  ]);

  const [products] = useState([
    { id: 1, name: 'Coffee', price: 3.50, emoji: '☕', category: 'Beverages' },
    { id: 2, name: 'Sandwich', price: 8.99, emoji: '🥪', category: 'Main Course' },
    { id: 3, name: 'Salad', price: 12.50, emoji: '🥗', category: 'Appetizer' },
    { id: 4, name: 'Pizza Slice', price: 4.25, emoji: '🍕', category: 'Main Course' },
    { id: 5, name: 'Burger', price: 11.99, emoji: '🍔', category: 'Main Course' },
    { id: 6, name: 'French Fries', price: 4.50, emoji: '🍟', category: 'Appetizer' },
    { id: 7, name: 'Soda', price: 2.25, emoji: '🥤', category: 'Beverages' },
    { id: 8, name: 'Ice Cream', price: 5.75, emoji: '🍦', category: 'Dessert' },
    { id: 9, name: 'Donut', price: 2.99, emoji: '🍩', category: 'Dessert' },
    { id: 10, name: 'Cookie', price: 1.99, emoji: '🍪', category: 'Dessert' },
    { id: 11, name: 'Cake', price: 6.50, emoji: '🍰', category: 'Dessert' },
    { id: 12, name: 'Tea', price: 2.75, emoji: '🍵', category: 'Beverages' },
    { id: 13, name: 'Wagyu Steak', price: 31.17, emoji: '🥩', category: 'Main Course' },
    { id: 14, name: 'Chicken Ramen', price: 17.70, emoji: '🍜', category: 'Main Course' },
    { id: 15, name: 'Fish and Chips', price: 23.05, emoji: '🐟', category: 'Main Course' }
  ]);

  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [lastTransaction, setLastTransaction] = useState({});

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const checkout = (total) => {
    setLastTransaction({ total, paymentMethod: 'cash' });
    setShowCheckoutModal(true);
    setCart([]);
  };

  const closeCheckoutModal = () => {
    setShowCheckoutModal(false);
  };

  return (
    <div className="pos-system">
      <div className="pos-header"></div> {/* Cleared header */}

      <div className="pos-main">
        <div className="pos-left">
          <Categories 
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
          <Menu 
            products={products}
            onAddToCart={addToCart}
            selectedCategory={selectedCategory}
          />
        </div>

        <div className="pos-right">
          <OrderSummary
            cart={cart}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeFromCart}
            onCheckout={checkout}
            onClear={clearCart}
          />
        </div>
      </div>

      {/* Modal (parang card na nag popop up) */}
      {showCheckoutModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-body">
              <div className="success-icon">✅</div>
              <h3 className="success-title">Payment Successful!</h3>
              <p className="success-amount">
                Total: <span className="amount">₱{lastTransaction.total?.toFixed(2)}</span>
              </p>
              <button onClick={closeCheckoutModal} className="continue-btn">
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default POS;
