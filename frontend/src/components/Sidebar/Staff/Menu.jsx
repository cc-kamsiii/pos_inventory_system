import React, { useState } from 'react';
import { Plus, Search, RefreshCw } from 'lucide-react';

const Menu = ({ products, onAddToCart, selectedCategory }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.item_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="menu-section">
      <div className="menu-header">
        <div className="search-bar">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search Menu"
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="refresh-btn" onClick={() => window.location.reload()}>
          <RefreshCw className="refresh-icon" />
          Refresh
        </button>
      </div>

      <div className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <span className="product-emoji">🍽️</span>
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
          ))
        ) : (
          <div className="no-items">
            <p>No items available in this category</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Menu;