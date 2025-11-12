import React, { useState } from "react";
import { Plus, Search, RefreshCw } from "lucide-react";

const Menu = ({ products, onAddToCart, selectedCategory, onRefresh, mostOrdered, recentOrders }) => {

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
