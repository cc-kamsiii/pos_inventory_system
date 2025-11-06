import React, { useState } from "react";
import { Plus, Search, RefreshCw } from "lucide-react";

const Menu = ({ products, onAddToCart, selectedCategory, onRefresh }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.item_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getStockLabel = (status) => {
    if (status === "no-stock") return "No Stock";
    if (status === "low-stock") return "Low Stock";
    return "Available";
  };

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
        <button className="refresh-btn" onClick={onRefresh}>
          <RefreshCw className="refresh-icon" />
          Refresh
        </button>
      </div>

      <div className="quick-access-sections">
        <div className="quick-section">
          <h3 className="section-title">Most Ordered</h3>
          <div className="quick-items">
            {mostOrdered && mostOrdered.length > 0 && (
              mostOrdered.map(item => (
                <div 
                  key={item.id} 
                  className="quick-item"
                  onClick={() => {
                    const product = products.find(p => p.id === item.product_id);
                    if (product) onAddToCart(product);
                  }}
                >
                  <div className="quick-item-info">
                    <span className="quick-item-name">{item.item_name}</span>
                    <span className="quick-item-count">{item.order_count} orders</span>
                  </div>
                  <span className="quick-item-price">₱{parseFloat(item.price).toFixed(2)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="quick-section">
          <h3 className="section-title">Recent Orders</h3>
          <div className="quick-items">
            {recentOrders && recentOrders.length > 0 && (
              recentOrders.map(order => (
                <div 
                  key={order.id} 
                  className="quick-item recent-order"
                  onClick={() => addRecentOrderToCart(order)}
                >
                  <div className="quick-item-info">
                    <span className="quick-item-name">
                      {order.items.map(i => i.item_name).join(', ')}
                    </span>
                    <span className="quick-item-count">{order.order_type}</span>
                  </div>
                  <span className="quick-item-price">₱{parseFloat(order.total).toFixed(2)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className={`product-card ${product.stockStatus}`}
            >
              <div className="product-image">
                <span className={`available-badge ${product.stockStatus}`}>
                  {getStockLabel(product.stockStatus)}
                </span>
              </div>

              <div className="product-info">
                <h3 className="product-name">
                  {product.item_name}{" "}
                  {product.size && (
                    <span className="product-size">({product.size})</span>
                  )}
                </h3>

                <p className="product-price">
                  ₱{parseFloat(product.price).toFixed(2)}
                </p>
                <button
                  className="add-to-cart-btn"
                  onClick={() => onAddToCart(product)}
                  disabled={product.stockStatus === "no-stock"}
                >
                  <Plus className="plus-icon" />
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No items found</p>
        )}
      </div>
    </div>
  );
};

export default Menu;
