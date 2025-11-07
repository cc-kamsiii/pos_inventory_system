import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import "../../../Style/Edit.css";

function Edit() {
  const [values, setValues] = useState({ 
    item: "", 
    price: "", 
    quantity: "", 
    unit: "",
    category: "" 
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  // Define categories
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

  // Auto-suggest category based on item name
  const getSuggestedCategory = (itemName) => {
    const lower = itemName.toLowerCase();

    // Meat & Poultry
    if (lower.includes("chicken") || lower.includes("tapa") || 
        lower.includes("lechon") || lower.includes("beef") || 
        lower.includes("pork") || lower.includes("meat") ||
        lower.includes("liempo") || lower.includes("egg")) {
      return "meat";
    }
    
    // Seafood
    if (lower.includes("bangus") || lower.includes("pulpo") || 
        lower.includes("fish") || lower.includes("shrimp") || 
        lower.includes("seafood")) {
      return "seafood";
    }
    
    // Vegetables & Produce
    if (lower.includes("broccoli") || lower.includes("vegetable") || 
        lower.includes("garlic") || lower.includes("onion") || 
        lower.includes("tomato") || lower.includes("lettuce") ||
        lower.includes("cabbage") || lower.includes("carrot") ||
        lower.includes("eggplant") || lower.includes("tokwa") ||
        lower.includes("tofu") || lower.includes("calamansi")) {
      return "vegetables";
    }
    
    // Condiments & Sauces
    if (lower.includes("sauce") || lower.includes("mayonnaise") || 
        lower.includes("ketchup") || lower.includes("gravy") || 
        lower.includes("condiment") || lower.includes("vinegar") ||
        lower.includes("fish sauce") || lower.includes("sinigang") ||
        lower.includes("cooking oil") || lower.includes("oil") ||
        lower.includes("black pepper") || lower.includes("pepper") ||
        lower.includes("salt")) {
      return "condiments";
    }
    
    // Beverages
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
    
    // Rice & Grains
    if (lower.includes("rice") || lower.includes("grain") || 
        lower.includes("flour")) {
      return "rice";
    }
    
    // Noodles
    if (lower.includes("noodle") || lower.includes("bihon") || 
        lower.includes("canton") || lower.includes("pasta") ||
        lower.includes("spaghetti")) {
      return "noodles";
    }
    
    // Processed & Canned Goods
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
    axios.get(`${API_BASE}/inventory/${id}`)
      .then(res => {
        const data = res.data[0];
        // Use existing category or auto-suggest if not present
        const category = data.category || getSuggestedCategory(data.item);
        setValues({ 
          item: data.item, 
          price: data.price, 
          quantity: data.quantity, 
          unit: data.unit,
          category: category
        });
      })
      .catch(err => console.log(err));
  }, [id]);

  const handleEdit = (e) => {
    e.preventDefault();
    setLoading(true);

    axios.put(`${API_BASE}/inventory/${id}`, values)
      .then(res => {
        console.log(res.data);
        setTimeout(() => {
          setLoading(false);
          navigate('/inventory');
        }, 800);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  };

  return (
    <div className="edit">
      <div className="edit-container">
        <form onSubmit={handleEdit}>
          <h2>Update Item</h2>

          <div className="edit-input">
            <label>Item name</label>
            <input
              type="text"
              value={values.item}
              onChange={e => setValues({ ...values, item: e.target.value })}
            />
          </div>

          <div className="edit-input">
            <label>Category</label>
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

          <div className="edit-input">
            <label>Price</label>
            <input
              type="number"
              value={values.price}
              onChange={e => setValues({ ...values, price: e.target.value })}
            />
          </div>

          <div className="edit-input">
            <label>Quantity</label>
            <input
              type="number"
              value={values.quantity}
              onChange={e => setValues({ ...values, quantity: e.target.value })}
            />
          </div>

          <div className="edit-input">
            <label>Unit</label>
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
            <div className="spinner" />
          </div>
        )}
      </div>
    </div>
  );
}

export default Edit;