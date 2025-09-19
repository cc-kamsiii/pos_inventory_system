 import { useEffect } from "react";
 import {Link} from 'react-router-dom';
 import { useState } from "react";
import "../../Style/ownerTransactions.css"
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
            <h2>TRANSACTIONS HISTORY</h2>

            <div className="title-row">
              <Link to="/add"><button className="add-btn">Add Inventory</button></Link>
              <form>
                <input type="text" placeholder="Search inventory" />
              </form>
            </div>
          </div>

            <div className="table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Item Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Order Type</th>
                    <th>Payment Method</th>
                    <th>Total Payment</th>
                    <th>Remarks</th>
                    <th>Order Date</th>
                  </tr>
                </thead>
                <tbody>
                    <td>1</td>
                    <td>TAPSILOG</td>
                    <td>2</td>
                    <td>95</td>
                    <td>Dine-in</td>
                    <td>Cash</td>
                    <td>190</td>
                    <td>Herald Cañaveral</td>
                    <td>9/19/2025</td>
                    

                    
                </tbody>
              </table>
            </div>

        </div>
    </div>
  );

};

export default Inventory;
