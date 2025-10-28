
import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {Link, useParams} from 'react-router-dom'
import "../../../Style/Read.css"
import Inventory from '../Inventory';

function Read() {

    const {id} = useParams();
    const [item, setItem] = useState(null);

    const API_BASE = import.meta.env.VITE_API_BASE_URL;

    useEffect(() =>{
        if(!id) return;
        axios.get(`${API_BASE}/inventory/${id}`)
        .then(res =>{
            console.log(res);
            setItem(res.data[0]);
        })
        .catch(err => console.log(err));
    }, [id])

    if (!item) {
        return (
            <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
                <div className="w-50 bg-white rounded p-3">
                <h2>No item</h2>
                </div>
            </div>
        );
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US"); 
    }

  return (
    <div className="read">
        <div className="read-container">
            <h2>Item Details:</h2>
            <div className="details">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Item Name</th>
                            <th>Quantity</th>
                            <th>Unit</th>
                            <th>Last Update</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{item.id}</td>
                            <td>{item.item}</td>
                            <td>{item.quantity}</td>
                            <td>{item.unit}</td>
                            <td>{formatDate(item.last_update)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className='read-button'>
                <Link to='/inventory'><button>Back</button></Link>
                <Link to={`/edit/${item.id}`}><button>Edit</button></Link>
            </div>
        </div>
    </div>
  )
}

export default Read