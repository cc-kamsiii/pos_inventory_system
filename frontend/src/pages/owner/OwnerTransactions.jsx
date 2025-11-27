import { useEffect, useState, Fragment } from "react";
import axios from "axios";
import { Search, ChevronRight, ChevronLeft, Calendar, ChevronDown } from "lucide-react";
import noTransaction from "../../assets/noTransaction.png";

function OwnerTransactions() {
  const [accounts, setAccounts] = useState([]);
  const [data, setData] = useState([]);
  const [groupedData, setGroupedData] = useState([]);
  const [date, setDate] = useState("");
  const [timeRange, setTimeRange] = useState("");
  const [cashierName, setCashierName] = useState("");
  const [menuSearch, setMenuSearch] = useState("");
  const [page, setPage] = useState(1);
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const convertTimeToHour = (timeStr) => {
    if (!timeStr) return null;
    const [hours] = timeStr.split(':');
    return parseInt(hours);
  };

  const updateTimeRange = (newStartTime, newEndTime) => {
    if (newStartTime && newEndTime) {
      const startHour = convertTimeToHour(newStartTime);
      const endHour = convertTimeToHour(newEndTime);
      setTimeRange(`${startHour}-${endHour}`);
    } else {
      setTimeRange("");
    }
  };

  const handleStartTimeChange = (e) => {
    const newStartTime = e.target.value;
    setStartTime(newStartTime);
    updateTimeRange(newStartTime, endTime);
  };

  const handleEndTimeChange = (e) => {
    const newEndTime = e.target.value;
    setEndTime(newEndTime);
    updateTimeRange(startTime, newEndTime);
  };

  const fetchAccounts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/auth/users`);
      setAccounts(res.data);
    } catch (err) {
      console.log("Error fetching accounts:", err);
    }
  };

  const fetchTransactions = () => {
    axios
      .get(`${API_BASE}/ownerTransactions`, {
        params: { 
          date: date, 
          time_range: timeRange,
          cashier_name: cashierName,
          menu_search: menuSearch,
          page 
        },
      })
      .then((res) => {
        setData(res.data);
        const grouped = groupTransactionsByOrder(res.data);
        setGroupedData(grouped);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [date, timeRange, cashierName, menuSearch, page]);

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
        <div className="title-section">
          <h2>TRANSACTION HISTORY</h2>
        </div>

        <div className="controls-section">
          <div className="pagination-controls">
            <span className="page-label">PAGE {page}</span>
            <div className="pagination-buttons">
              <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>
                <ChevronLeft size={16} />
              </button>
              <button onClick={() => setPage((prev) => prev + 1)}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="filters-row">
            <div className="search-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search Menu"
                value={menuSearch}
                onChange={(e) => setMenuSearch(e.target.value)}
                className="filter-input search-input"
              />
            </div>

            <div className="date-container">
              
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="filter-input date-input"
              />
            </div>

            <div className="time-range-group">
              <input
                type="time"
                value={startTime}
                onChange={handleStartTimeChange}
                className="filter-input time-input"
              />
              <span className="time-separator">-</span>
              <input
                type="time"
                value={endTime}
                onChange={handleEndTimeChange}
                className="filter-input time-input"
              />
            </div>

            <div className="select-container">
              <select 
                value={cashierName} 
                onChange={(e) => setCashierName(e.target.value)} 
                className="filter-input cashier-select"
              >
                <option value="">All Cashier</option>
                {accounts
                  .filter((account) => account.role === "staff")
                  .map((account) => (
                    <option key={account.id} value={account.name}>
                      {account.name}
                    </option>
                  ))}
              </select>
              <ChevronDown className="chevron-down-icon" />
            </div>
          </div>
        </div>

        <div className="table-container">
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
                <th>Order Time</th>
              </tr>
            </thead>
            <tbody>
              {groupedData.length === 0 ? (
                <tr>
                  <td colSpan="9" className="no-data-cell">
                    <div className="no-data-content">
                      <img
                        src={noTransaction}
                        alt="No Transactions"
                        className="noTransaction"
                      />
                      <div className="no-data-text">No transactions found</div>
                    </div>
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
                        {new Date(order.order_date).toLocaleDateString("en-US", {
                          year: "2-digit",
                          month: "numeric",
                          day: "numeric",
                        })}
                      </td>
                      <td>
                        {new Date(order.order_date).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>

                    {expandedOrders.has(order.order_id) && (
                      <>
                        <tr className="items-header">
                          <td colSpan="9">
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
                            <td>Price: ₱{parseFloat(item.price).toFixed(2)}</td>
                            <td colSpan="5">
                              Subtotal: ₱
                              {(parseFloat(item.price) * item.quantity).toFixed(2)}
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