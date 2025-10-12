import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../../../Style/Add.css";

function Add() {
  const [values, setValues] = useState({
    item: "",
    quantity: "",
    unit: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    axios.post("http://localhost:8081/inventory", values)
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
              onChange={e => setValues({ ...values, item: e.target.value })}
            />
          </div>

          <div className="inventory-input">
            <input
              type="number"
              placeholder="Enter Quantity"
              required
              onChange={e => setValues({ ...values, quantity: e.target.value })}
            />
          </div>

          <div className="inventory-input">
            <select
              required
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
