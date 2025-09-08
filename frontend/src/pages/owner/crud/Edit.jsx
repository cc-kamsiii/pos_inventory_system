import React from 'react'
import axios from 'axios';
import {useState, useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "../../../Style/Edit.css"

function Edit() {


    const [values, setValues] = useState({
        item: "",
        quantity: "",
        unit: ""
    });

    const navigate = useNavigate();
    const {id} = useParams();

    useEffect(() =>{
        axios.get(`http://localhost:8081/inventory/${id}`)
        .then(res =>{
            console.log(res);
            setValues({...values, item: res.data[0].item, quantity: res.data[0].quantity, unit: res.data[0].unit })
        })
        .catch(err => console.log(err));
    }, [id])

    const handleEdit = (e) =>{
        e.preventDefault();
        axios.put(`http://localhost:8081/inventory/${id}`, values)
        .then(res =>{
            console.log(res);
            navigate('/inventory');
        })
        .catch(err => console.log(err));
    }

  return (
    <div className='edit'>
        <div className='edit-container'>
            <form onSubmit={handleEdit}> 
                <h2>Update Item</h2>
                <div className="edit-input">
                    <label htmlFor=''>Item name</label>
                    <input type='text'  value = {values.item}
                    onChange={e => setValues({...values, item: e.target.value})}/>
                </div>

                <div className="edit-input">
                    <label htmlFor=''>Quantity</label>
                    <input type='text'  value={values.quantity}
                    onChange={e => setValues({...values, quantity: e.target.value})}/>
                </div>

                <div className="edit-input">
                    <label htmlFor=''>Unit</label>
                    <select className="form-control" required  value={values. unit} onChange={e => setValues({...values, unit: e.target.value})}> 
                        <option value="">SELECT UNIT</option>
                        <option value="kg">kg</option>
                        <option value="pcs">pcs</option>
                        <option value="g">g</option>
                     </select>
                </div>

                <button>Submit</button>

            </form>
        </div>
    </div>
  )
}

export default Edit