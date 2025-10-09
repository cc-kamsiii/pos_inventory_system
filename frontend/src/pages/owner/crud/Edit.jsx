import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import "../../../Style/Edit.css";

function Edit() {
  const [values, setValues] = useState({ item: "", quantity: "", unit: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    axios.get(`http://localhost:8081/inventory/${id}`)
      .then(res => {
        const data = res.data[0];
        setValues({ item: data.item, quantity: data.quantity, unit: data.unit });
      })
      .catch(err => console.log(err));
  }, [id]);

  const handleEdit = (e) => {
    e.preventDefault();
    setLoading(true);

    axios.put(`http://localhost:8081/inventory/${id}`, values)
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
        setMessage("Error updating item");
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
