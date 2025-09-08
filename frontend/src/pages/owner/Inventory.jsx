 import { useEffect } from "react";
 import {Link} from 'react-router-dom';
 import { useState } from "react";
import "../../Style/Inventory.css"
import axios from 'axios';

function Inventory () {

  const [data, setData] = useState([]);

  useEffect(() =>{
    axios.get('http://localhost:8081/inventory')
    .then(res => setData(res.data))
    .catch(err => console.log(err));
  })

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US"); 
  }

  const handleDelete = (id) =>{
    axios.delete(`http://localhost:8081/inventory/${id}`)
    .then(res =>{
      setData(data.filter(item => item.id != id));
    })
    .catch(err => console.log(err));
  }



  return (
    <div className="inventory">
        <div className="inventory-container">
          <div className="title-search-create">
            <div>
              <h2>Inventory Management</h2>
            </div>
              <form>
                <input type="text" placeholder="Search inventory"/>
              </form>
              <div>
                <Link to='/add'><button>Add Inventory</button></Link>
              </div>
          </div>

            <div className="table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Item Name</th>
                    <th>Quantity</th>
                    <th>Unit</th>
                    <th>Last Update</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                    {data.map((inventory, index) =>{
                      return <tr key={index}>
                          <td>{inventory.id}</td>
                          <td>{inventory.item}</td>
                          <td>{inventory.quantity}</td>
                          <td>{inventory.unit}</td>
                          <td>{formatDate(inventory.last_update)}</td>
                          <td>
                            <div className="action-button">
                             <Link to={`/read/${inventory.id}`}> <button>Read</button> </Link> 
                              <Link to={`/edit/${inventory.id}`}><button>Edit</button> </Link>
                              <button 
                                  onClick={() => {
                                    if (window.confirm("Are you sure you want to delete this item?")) {
                                      handleDelete(inventory.id);
                                    }
                                  }}
                                >
                                  Delete
                              </button>
                            </div>
                          </td>
                      </tr>
                    })}

                    
                </tbody>
              </table>
            </div>

        </div>
    </div>
  );

};

export default Inventory;
