import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../../../Style/Add.css";

function Add() {
  const [values, setValues] = useState({
    item: "",
    price: "",
    quantity: "",
    unit: "",
    category: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const categories = [
    { value: "meat", label: "Meat & Poultry" },
    { value: "seafood", label: "Seafood" },
    { value: "vegetables", label: "Vegetables & Produce" },
    { value: "condiments", label: "Condiments & Sauces" },
    { value: "beverages", label: "Beverages" },
    { value: "rice", label: "Rice & Grains" },
    { value: "noodles", label: "Noodles" },
    { value: "processed", label: "Processed & Canned Goods" },
    { value: "other", label: "Other" }
  ];

  const getSuggestedCategory = (itemName) => {
    const lower = itemName.toLowerCase();

    if (lower.includes("chicken") || lower.includes("tapa") || 
        lower.includes("lechon") || lower.includes("beef") || 
        lower.includes("pork") || lower.includes("meat") ||
        lower.includes("liempo") || lower.includes("egg")) {
      return "meat";
    }
    
    if (lower.includes("bangus") || lower.includes("pulpo") || 
        lower.includes("fish") || lower.includes("shrimp") || 
        lower.includes("seafood")) {
      return "seafood";
    }
    
    if (lower.includes("broccoli") || lower.includes("vegetable") || 
        lower.includes("garlic") || lower.includes("onion") || 
        lower.includes("tomato") || lower.includes("lettuce") ||
        lower.includes("cabbage") || lower.includes("carrot") ||
        lower.includes("eggplant") || lower.includes("tokwa") ||
        lower.includes("tofu") || lower.includes("calamansi")) {
      return "vegetables";
    }
    
    if (lower.includes("sauce") || lower.includes("mayonnaise") || 
        lower.includes("ketchup") || lower.includes("gravy") || 
        lower.includes("condiment") || lower.includes("vinegar") ||
        lower.includes("fish sauce") || lower.includes("sinigang") ||
        lower.includes("cooking oil") || lower.includes("oil") ||
        lower.includes("black pepper") || lower.includes("pepper") ||
        lower.includes("salt")) {
      return "condiments";
    }
    
    if (lower.includes("juice") || lower.includes("lemonade") || 
        lower.includes("syrup") || lower.includes("mix") || 
        lower.includes("drink") || lower.includes("beverage") ||
        lower.includes("soda") || lower.includes("water") ||
        lower.includes("coffee") || lower.includes("yakult") ||
        lower.includes("coke") || lower.includes("sprite") ||
        lower.includes("royal") || lower.includes("mountain dew") ||
        lower.includes("pepsi") || lower.includes("mug") ||
        lower.includes("rootbeer")) {
      return "beverages";
    }
    
    if (lower.includes("rice") || lower.includes("grain") || 
        lower.includes("flour")) {
      return "rice";
    }
    
    if (lower.includes("noodle") || lower.includes("bihon") || 
        lower.includes("canton") || lower.includes("pasta") ||
        lower.includes("spaghetti")) {
      return "noodles";
    }
    
    if (lower.includes("corned beef") || lower.includes("luncheon") ||
        lower.includes("longganisa") || lower.includes("hotdog") ||
        lower.includes("hot dog") || lower.includes("tocino") ||
        lower.includes("ham") || lower.includes("hungarian") ||
        lower.includes("sausage") || lower.includes("sardines") ||
        lower.includes("canned") || lower.includes("processed")) {
      return "processed";
    }

    return "other";
  };

  useEffect(() => {
    if (values.item && !values.category) {
      const suggestedCategory = getSuggestedCategory(values.item);
      setValues(prev => ({ ...prev, category: suggestedCategory }));
    }
  }, [values.item]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    axios.post(`${API_BASE}/inventory`, values)
      .then(res => {
        console.log(res.data);
        setTimeout(() => {
          setLoading(false);
          navigate("/inventory");
        }, 1000);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  return (
    <div className="add-inventory">
      <div className="containerInventory">
        <form onSubmit={handleSubmit}>
          <h2>Add Items</h2>

          <div className="inventory-input">
            <input
              type="text"
              placeholder="Enter Item Name"
              required
              value={values.item}
              onChange={e => setValues({ ...values, item: e.target.value })}
            />
          </div>

          <div className="inventory-input">
            <select
              required
              value={values.category}
              onChange={e => setValues({ ...values, category: e.target.value })}
              className="category-select"
            >
              <option value="">SELECT CATEGORY</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="inventory-input">
            <input
              type="number"
              placeholder="Enter Price"
              required
              value={values.price}
              onChange={e => setValues({ ...values, price: e.target.value })}
            />
          </div>

          <div className="inventory-input">
            <input
              type="number"
              placeholder="Enter Quantity"
              required
              value={values.quantity}
              onChange={e => setValues({ ...values, quantity: e.target.value })}
            />
          </div>

          <div className="inventory-input">
            <select
              required
              value={values.unit}
              onChange={e => setValues({ ...values, unit: e.target.value })}
            >
              <option value="">SELECT UNIT</option>
              <option value="kg">kg</option>
              <option value="pcs">pcs</option>
              <option value="packs">packs</option>
              <option value="L">L</option>
              <option value="bottles">bottles</option>
              <option value="cans">cans</option>
              <option value="sachets">sachets</option>
              <option value="blocks">blocks</option>
              <option value="slices">slices</option>
              <option value="g">g</option>
            </select>
          </div>

          <button className="btn btn-success" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>

        {loading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Add;