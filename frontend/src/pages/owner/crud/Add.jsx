import React, { useState } from 'react'
import axios from 'axios'   // ✅ missing import
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
        console.log(res);
        navigate('/inventory');
      })
      .catch(err => console.log(err));
  }

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
              onChange={e => setValues({...values, item: e.target.value})}
            />
          </div>

          <div className="inventory-input">
            <input 
              type="number" 
              placeholder="Enter Quantity" 
              className="form-control" 
              required 
              onChange={e => setValues({...values, quantity: e.target.value})}
            />
          </div>

          <div className="inventory-input">
            <select 
              name="unit" 
              className="form-control" 
              required 
              onChange={e => setValues({...values, unit: e.target.value})}
            > 
              <option value="">SELECT UNIT</option>
              <option value="kg">kg</option>
              <option value="pcs">pcs</option>
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
