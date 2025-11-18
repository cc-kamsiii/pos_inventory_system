import React, { useEffect, useState } from "react";
import axios from "axios";
import { Package, ShoppingCart, PhilippinePesoIcon } from "lucide-react";
import { Chart } from "react-google-charts";
import "../../Style/Dashboard.css";

const Dashboard = () => {
  const [cashierLogins, setCashierLogins] = useState([]);
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);

  const [totalSales, setTotalSales] = useState(0);
  const [cashSales, setCashSales] = useState(0);
  const [gcashSales, setGcashSales] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [dineInOrders, setDineInOrders] = useState(0);
  const [takeoutOrders, setTakeoutOrders] = useState(0);
  const [totalInventory, setTotalInventory] = useState(0);
  const [noStockCount, setNoStockCount] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mostSellingData, setMostSellingData] = useState([
    ["Menu Item", "Quantity Sold"],
  ]);

  const [chartPeriod, setChartPeriod] = useState("monthly");
  const [barData, setBarData] = useState([
    ["Period", "Sales", { role: "style" }],
  ]);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const fetchCashierLogins = async () => {
    try {
      const res = await axios.get(
        `${API_BASE}/ownerTransactions/cashier_logins`,
        {
          params: { date: selectedDate || undefined },
        }
      );
      setCashierLogins(res.data || []);
    } catch (err) {
      console.error("Error fetching cashier logins:", err);
    }
  };

  useEffect(() => {
    fetchCashierLogins();
  }, [selectedDate]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [
          salesRes,
          ordersRes,
          inventoryRes,
          mostSellingRes,
          barRes,
        ] = await Promise.all([
          axios.get(
            `${API_BASE}/ownerTransactions/total_sales_breakdown?period=${chartPeriod}`
          ),
          axios.get(
            `${API_BASE}/ownerTransactions/orders_summary?period=${chartPeriod}`
          ),
          axios.get(`${API_BASE}/inventory/summary`),
          axios.get(
            `${API_BASE}/ownerTransactions/most_selling_menu?period=${chartPeriod}`
          ),
          axios.get(
            `${API_BASE}/ownerTransactions/sales_chart?period=${chartPeriod}`
          ),
        ]);

        setTotalSales(salesRes.data?.total_sales || 0);
        setCashSales(salesRes.data?.cash_sales || 0);
        setGcashSales(salesRes.data?.gcash_sales || 0);
        setTotalOrders(ordersRes.data?.total_orders || 0);
        setDineInOrders(ordersRes.data?.dine_in || 0);
        setTakeoutOrders(ordersRes.data?.takeout || 0);
        setTotalInventory(inventoryRes.data?.total_inventory || 0);
        setLowStockCount(inventoryRes.data?.low_stock || 0);
        setNoStockCount(inventoryRes.data?.no_stock || 0);

        setMostSellingData(
          mostSellingRes.data && mostSellingRes.data.length > 1
            ? [mostSellingRes.data[0], ...mostSellingRes.data.slice(1, 6)]
            : [["Menu Item", "Quantity Sold"]]
        );

        setBarData(barRes.data || [["Period", "Sales", { role: "style" }]]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [chartPeriod]);

  const currentDate = new Date();

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatNumber = (num) => {
    return Number(num).toLocaleString('en-US', { 
      minimumFractionDigits: 0,
      maximumFractionDigits: 2 
    });
  };

  const barOptions = {
    title: `${chartPeriod.charAt(0).toUpperCase() + chartPeriod.slice(1)} Sales`,
    backgroundColor: "transparent",
    legend: { position: "none" },
    vAxis: { 
      format: "decimal",
      textStyle: { fontSize: 12 }
    },
    hAxis: {
      textStyle: { fontSize: 12 }
    },
    tooltip: { 
      isHtml: true,
      trigger: 'both'
    },
    chartArea: { width: '80%', height: '70%' }
  };

  const pieOptions = {
    title: "Most Selling Menu",
    pieHole: 0.4,
    backgroundColor: "transparent",
    legend: { position: "right" },
    tooltip: { 
      text: "value",
      trigger: 'both'
    },
    colors: ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"],
    chartArea: { width: '90%', height: '80%' }
  };

  return (
    <div className="dashboard-container">
      <div className="main-content">
        <div className="header">
          <div className="header-content">
            <div className="header-right">
              <div className="dashboard-info">
                <p className="dashboard-title">Dashboard</p>
                <p className="dashboard-date">{formatDate(currentDate)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="select-choices">
          <select
            value={chartPeriod}
            onChange={(e) => setChartPeriod(e.target.value)}
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        <div className="stats-grid">
          <div className="stat-card yellow-gradient">
            <div className="stat-card-header">
              <p className="stat-label">Income</p>
            </div>
            <p className="stat-value">
              {loading ? "Loading..." : `₱ ${formatNumber(totalSales)}`}
            </p>
            <div className="stat-breakdown">
              <p>Cash: ₱ {formatNumber(cashSales)}</p>
              <p>GCash: ₱ {formatNumber(gcashSales)}</p>
            </div>
            <PhilippinePesoIcon className="stat-icon" size={32} />
          </div>

          <div className="stat-card blue-gradient">
            <p className="stat-label">Orders</p>
            <p className="stat-value">
              {loading ? "Loading..." : formatNumber(totalOrders)}
            </p>
            <div className="stat-breakdown">
              <p>Dine In: {formatNumber(dineInOrders)}</p>
              <p>Takeout: {formatNumber(takeoutOrders)}</p>
            </div>
            <ShoppingCart className="stat-icon" size={32} />
          </div>

          <div className="stat-card gray-gradient">
            <p className="stat-label">Inventory Overview</p>
            <p className="stat-value">
              {loading ? "Loading..." : `${formatNumber(totalInventory)} items`}
            </p>
            <p className="stat-subvalue">
              {!loading && (
                <>
                  Low Stock: {formatNumber(lowStockCount)} <br />
                  No Stock: {formatNumber(noStockCount)}
                </>
              )}
            </p>
            <Package className="stat-icon" size={32} />
          </div>
        </div>

        <div className="charts-grid">
          <div className="chart-card">
            <Chart
              chartType="PieChart"
              data={mostSellingData}
              options={pieOptions}
              width="100%"
              height="300px"
            />
          </div>

          <div className="chart-card">
            <Chart
              chartType="ColumnChart"
              data={barData}
              options={barOptions}
              width="100%"
              height="300px"
            />
          </div>

          <div className="chart-card">
            <h3>Cashier Login Records</h3>
            <div className="login-filter">
              <label>Filter by date: </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
              <button onClick={() => setSelectedDate("")}>Show All</button>
            </div>

            <div className="login-table-container">
              <table className="login-table">
                <thead>
                  <tr>
                    <th>Cashier Name</th>
                    <th>Login Time</th>
                  </tr>
                </thead>
                <tbody>
                  {cashierLogins.length > 0 ? (
                    cashierLogins.map((log, index) => (
                      <tr key={index}>
                        <td>{log.first_name}</td>
                        <td>{log.login_time}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2">No login records found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;