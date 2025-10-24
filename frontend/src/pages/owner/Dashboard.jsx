import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  TrendingUp,
  Package,
  ShoppingCart,
  PieChart,
  Clock,
  PhilippinePesoIcon,
} from "lucide-react";
import { Chart } from "react-google-charts";
import "../../Style/Dashboard.css";

const Dashboard = () => {
  const [totalSales, setTotalSales] = useState(0);
  const [cashSales, setCashSales] = useState(0);
  const [gcashSales, setGcashSales] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [dineInOrders, setDineInOrders] = useState(0);
  const [takeoutOrders, setTakeoutOrders] = useState(0);
  const [totalInventory, setTotalInventory] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("monthly");
  const [barData, setBarData] = useState([
    ["Period", "Sales", { role: "style" }],
  ]); // Default empty data
  const [pieData, setPieData] = useState([["Category", "Amount"]]); // Default empty data

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [salesRes, ordersRes, inventoryRes] = await Promise.all([
          axios.get(
            "http://localhost:8081/ownerTransactions/total_sales_breakdown"
          ),
          axios.get("http://localhost:8081/ownerTransactions/orders_summary"),
          axios.get("http://localhost:8081/inventory/summary"),
        ]);

        setTotalSales(salesRes.data?.total_sales || 0);
        setCashSales(salesRes.data?.cash_sales || 0);
        setGcashSales(salesRes.data?.gcash_sales || 0);
        setTotalOrders(ordersRes.data?.total_orders || 0);
        setDineInOrders(ordersRes.data?.dine_in || 0);
        setTakeoutOrders(ordersRes.data?.takeout || 0);
        setTotalInventory(inventoryRes.data?.total_inventory || 0);
        setLowStockCount(inventoryRes.data?.low_stock || 0);

        await fetchChartData(period);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [period]);

  const fetchChartData = async (selectedPeriod) => {
    try {
      const [barRes, pieRes] = await Promise.all([
        axios.get(
          `http://localhost:8081/ownerTransactions/sales_chart?period=${selectedPeriod}`
        ),
        axios.get("http://localhost:8081/menu/sales_by_category"),
      ]);
      setBarData(barRes.data || [["Period", "Sales", { role: "style" }]]);
      setPieData(pieRes.data || [["Category", "Amount"]]);
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  const currentDate = new Date();

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const barOptions = {
    title: `${period.charAt(0).toUpperCase() + period.slice(1)} Sales`,
    backgroundColor: "transparent",
    legend: { position: "none" },
  };

  const categoryOptions = {
    title: "Sales by Product Category",
    pieHole: 0.4,
    colors: ["#8b5cf6", "#3b82f6", "#f59e0b"],
    backgroundColor: "transparent",
    legend: { position: "right" },
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

        <div className="stats-grid">
          <div className="stat-card yellow-gradient">
            <p className="stat-label">Total Sales</p>
            <p className="stat-value">
              {loading ? "Loading..." : `₱ ${totalSales.toLocaleString()}`}
            </p>
            <div className="stat-breakdown">
              <p>Cash: ₱ {cashSales.toLocaleString()}</p>
              <p>GCash: ₱ {gcashSales.toLocaleString()}</p>
            </div>
            <PhilippinePesoIcon className="stat-icon" size={32} />
          </div>

          <div className="stat-card blue-gradient">
            <p className="stat-label">Orders</p>
            <p className="stat-value">{loading ? "Loading..." : totalOrders}</p>
            <div className="stat-breakdown">
              <p>Dine In: {dineInOrders}</p>
              <p>Takeout: {takeoutOrders}</p>
            </div>
            <ShoppingCart className="stat-icon" size={32} />
          </div>

          <div className="stat-card gray-gradient">
            <p className="stat-label">Inventory Overview</p>
            <p className="stat-value">
              {loading ? "Loading..." : `${totalInventory} items`}
            </p>
            <p className="stat-subvalue">
              {loading ? "" : `Low Stock: ${lowStockCount}`}
            </p>
            <Package className="stat-icon" size={32} />
          </div>
        </div>

        <div className="dashboard-controls">
          <select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        <div className="charts-grid">
          <div className="chart-card">
            <Chart
              chartType="PieChart"
              data={pieData}
              options={categoryOptions}
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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
