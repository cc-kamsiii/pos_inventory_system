 import { useEffect } from "react";
 import {Link} from 'react-router-dom';
 import { useState } from "react";
import "../../Style/staffTransactions.css"
import axios from 'axios';

function StaffTransactions () {

  
  const [data, setData] = useState([]);

  useEffect(()=>{
    axios.get("http://localhost:8081/staffTransactions")
    .then(res => setData(res.data))
    .catch(err => console.log(err))
  },[]);


  return (
    <div className="inventory">
        <div className="inventory-container">
          <div className="title-search-create">
            <h2>TRANSACTIONS HISTORY</h2>

            <div className="title-row">
              <button className="add-btn">Range</button>
              <form>
                <input type="text" placeholder="Search transactions" />
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
                    <th>Cashier</th>
                    <th>Order Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, index) =>(
                    <tr key={index}>
                      <td>{row.transaction_id}</td>
                      <td>{row.item_name}</td>
                      <td>{row.quantity}</td>
                      <td>{row.price}</td>
                      <td>{row.order_type}</td>
                      <td>{row.payment_method}</td>
                      <td>{row.total_payment}</td>
                      <td>{row.cashier_name}</td>
                      <td>
                        {new Date(row.order_date).toLocaleDateString("en-US", {
                          year: "2-digit",
                          month: "numeric",
                          day: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

        </div>
    </div>
  );

};

export default StaffTransactions;
