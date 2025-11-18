import { useEffect, useState } from "react";
import axios from "axios";
import { ChevronRight, ChevronLeft } from "lucide-react";
import noTransaction from "../../assets/noTransaction.png";



function StaffTransactions() {
  const [data, setData] = useState([]);
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const fetchTransactions = () => {
    axios
      .get(`${API_BASE}/ownerTransactions`, {
        params: { date, page },
      })
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchTransactions();
  }, [date, page]);

  return (
    <div className="inventory">
      <div className="inventory-container">
        <div className="title-search-create">
          <h2>TRANSACTIONS HISTORY</h2>

          <div className="title-row">
            <div className="pagination">
              <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>
                <ChevronLeft size={20} />
              </button>
              <span>Page: {page}</span>
              <button onClick={() => setPage((prev) => prev + 1)}>
                {" "}
                <ChevronRight size={20} />{" "}
              </button>
            </div>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
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
                <th>Total</th>
                <th>Cashier</th>
                <th>Order Date</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan="9"
                    style={{ textAlign: "center", padding: "15px" }}
                  >
                    <img
                      src={noTransaction}
                      alt="No Transactions"
                      className="noTransaction"
                    />
                  </td>
                </tr>
              ) : (
                data.map((row, index) => (
                  <tr key={index}>
                    <td>{row.transaction_id}</td>
                    <td>{row.item_name}</td>
                    <td>{row.quantity}</td>
                    <td>₱{row.price}</td>
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default StaffTransactions;
