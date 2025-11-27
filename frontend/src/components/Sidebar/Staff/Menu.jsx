import React from "react";
import { Plus, Search } from "lucide-react";
import "../../../Style/Menu.css";
import "../../../Style/Search.css";

const Menu = ({ products, onAddToCart, selectedCategory, searchQuery, onSearchChange }) => {

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    return matchesCategory;
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
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className={`product-card ${product.stockStatus}`}
            >
              <span className={`available-badge ${product.stockStatus}`}>
                {getStockLabel(product.stockStatus)}
              </span>

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
          <p className="no-items-message">
            {searchQuery 
              ? `No menu items found matching "${searchQuery}"`
              : "No items found"
            }
          </p>
        )}
      </div>
    </div>
  );
};

export default Menu;