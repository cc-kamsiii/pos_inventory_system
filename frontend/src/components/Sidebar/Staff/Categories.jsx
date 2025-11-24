import React from 'react';
import "../../../Style/Categories.css";

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

export default Categories;