import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
        <button className="refresh-btn" onClick={() => window.location.reload()}>
          <RefreshCw className="refresh-icon" />
          Refresh
        </button>
      </div>
      
      <div className="products-grid">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <span className="product-emoji">🍽️</span> {/* Default emoji, since DB has no emoji */}
              <button className="available-badge">Available</button>
            </div>
            <div className="product-info">
              <h3 className="product-name">{product.item_name}</h3>
              <p className="product-price">₱{parseFloat(product.price).toFixed(2)}</p>
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
              <span className="item-emoji">🍽️</span>
            </div>
            <div className="item-details">
              <h4 className="item-name">{item.item_name}</h4>
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

// POS
function POS() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [lastTransaction, setLastTransaction] = useState({});

  // Fetch from backend
  useEffect(() => {
    axios.get("http://localhost:8081/menu")        
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));

    axios.get("http://localhost:8081/menu/categories") 
      .then(res => {
        const allCount = res.data.reduce((sum, c) => sum + c.count, 0);
        setCategories([
          { name: "All", count: allCount },
          ...res.data.map(c => ({ name: c.category, count: c.count }))
        ]);
      })
      .catch(err => console.error(err));
  }, []);

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

      {/* Modal */}
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
