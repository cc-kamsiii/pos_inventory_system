import { useEffect, useState, Fragment } from "react";
import axios from "axios";
import { ChevronRight, ChevronLeft } from "lucide-react";
import noTransaction from "../../assets/noTransaction.png";

function OwnerTransactions() {
  const [data, setData] = useState([]);
  const [groupedData, setGroupedData] = useState([]);
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);
  const [expandedOrders, setExpandedOrders] = useState(new Set());

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const fetchTransactions = () => {
    axios
      .get(`${API_BASE}/ownerTransactions`, {
        params: { date, page },
      })
      .then((res) => {
        setData(res.data);

        const grouped = groupTransactionsByOrder(res.data);
        setGroupedData(grouped);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchTransactions();
  }, [date, page]);

  const groupTransactionsByOrder = (transactions) => {
    const grouped = {};

    transactions.forEach((transaction) => {
      const orderId = transaction.order_id || transaction.transaction_id;

      if (!grouped[orderId]) {
        grouped[orderId] = {
          order_id: orderId,
          order_type: transaction.order_type,
          payment_method: transaction.payment_method,
          total_payment: transaction.total_payment,
          payment_amount: transaction.payment_amount || 0,
          change_amount: transaction.change_amount || 0,
          cashier_name: transaction.cashier_name,
          order_date: transaction.order_date,
          items: [],
        };
      }

      grouped[orderId].items.push({
        transaction_id: transaction.transaction_id,
        item_name: transaction.item_name,
        quantity: transaction.quantity,
        price: transaction.price,
      });
    });

    return Object.values(grouped).sort((a, b) => b.order_id - a.order_id);
  };

  const toggleOrder = (orderId) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

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
                <ChevronRight size={20} />
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
                <th>Order ID</th>
                <th>Order Type</th>
                <th>Payment Method</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Change</th>
                <th>Cashier</th>
                <th>Order Date</th>
              </tr>
            </thead>
            <tbody>
              {groupedData.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
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
                groupedData.map((order) => (
                  <Fragment key={`order-${order.order_id}`}>
                    <tr
                      className="order-row clickable"
                      onClick={() => toggleOrder(order.order_id)}
                    >
                      <td className="order-id-cell">
                        <span
                          className={`expand-icon ${
                            expandedOrders.has(order.order_id) ? "expanded" : ""
                          }`}
                        >
                          ▶
                        </span>
                        {order.order_id}
                      </td>

                      <td>{order.order_type}</td>
                      <td>{order.payment_method}</td>
                      <td>₱{parseFloat(order.total_payment).toFixed(2)}</td>

                      <td>₱{parseFloat(order.payment_amount).toFixed(2)}</td>
                      <td>₱{parseFloat(order.change_amount).toFixed(2)}</td>

                      <td>{order.cashier_name}</td>
                      <td>
                        {new Date(order.order_date).toLocaleDateString(
                          "en-US",
                          {
                            year: "2-digit",
                            month: "numeric",
                            day: "numeric",
                          }
                        )}
                      </td>
                    </tr>

                    {expandedOrders.has(order.order_id) && (
                      <>
                        <tr className="items-header">
                          <td colSpan="8">
                            <strong>Items in Order #{order.order_id}</strong>
                          </td>
                        </tr>
                        {order.items.map((item) => (
                          <tr
                            key={`item-${item.transaction_id}`}
                            className="item-row"
                          >
                            <td></td>
                            <td>{item.item_name}</td>
                            <td>Qty: {item.quantity}</td>
                            <td>₱{parseFloat(item.price).toFixed(2)}</td>
                            <td colSpan="4">
                              Subtotal: ₱{(parseFloat(item.price) * item.quantity).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </>
                    )}
                  </Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default OwnerTransactions;