import React, { useState } from 'react'
import axios from 'axios'
import "../../../Style/Add.css"
import { useNavigate } from 'react-router-dom'

function Add() {
  const [values, setValues] = useState({
    item: "",
    quantity: "",
    unit: "",
  })

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8081/inventory', values)
      .then(res => {
        console.log("Response:", res.data);
        if (res.data.success) {
          alert("Item added successfully!");
          navigate('/inventory', { replace: true });
        } else {
          alert("Failed to add item. Try again.");
        }
      })
      .catch(err => {
        console.error("Error:", err);
        alert("Server error. Please check backend logs.");
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
              className="form-control"
              required
              onChange={e => setValues({ ...values, item: e.target.value })}
            />
          </div>

          <div className="inventory-input">
            <input
              type="number"
              placeholder="Enter Quantity"
              className="form-control"
              required
              onChange={e => setValues({ ...values, quantity: e.target.value })}
            />
          </div>

          <div className="inventory-input">
            <select
              name="unit"
              className="form-control"
              required
              onChange={e => setValues({ ...values, unit: e.target.value })}
            >
              <option value="">SELECT UNIT</option>
              <option value="kg">kg</option>
              <option value="pcs">pcs</option>
              <option value="packs">packs</option>
              <option value="L">L </option>
              <option value="bottles">bottles</option>
              <option value="cans">cans</option>
              <option value="sachets">sachets</option>
              <option value="blocks">blocks</option>
              <option value="slices">slices</option>
              <option value="g">g</option>
            </select>
          </div>

          <button className="btn btn-success">Submit</button>
        </form>
      </div>
    </div>
  )
}

export default Add
