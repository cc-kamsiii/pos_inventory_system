import React, { useEffect, useState } from "react";
import axios from "axios";
import { Package, ShoppingCart, Clock, PhilippinePesoIcon } from "lucide-react";
import { Chart } from "react-google-charts";
import "../../Style/Dashboard.css";

const Dashboard = () => {
  // Period filter: weekly | monthly | yearly
  const [period, setPeriod] = useState("weekly");

  // Metrics from backend dashboard endpoint
  const [metrics, setMetrics] = useState({
    totalSales: 0,
    ordersCount: 0,
    paymentBreakdown: { cash: 0, gcash: 0 },
    orderBreakdown: { dine_in: 0, takeout: 0 },
    barSeries: [["Period", "Sales"]],
    pieSeries: [["Category", "Sales"]],
  });
  const [metricsLoading, setMetricsLoading] = useState(true);

  // Inventory summary (items count and low stock)
  const [inventorySummary, setInventorySummary] = useState({ totalItems: 0, lowStock: 0 });
  const [inventoryLoading, setInventoryLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      setMetricsLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:8081/ownerTransactions/dashboard?period=${period}`
        );
        setMetrics(res.data);
      } catch (error) {
        console.error("Error fetching dashboard metrics:", error);
      } finally {
        setMetricsLoading(false);
      }
    };
    fetchMetrics();
  }, [period]);

  useEffect(() => {
    const fetchInventory = async () => {
      setInventoryLoading(true);
      try {
        const res = await axios.get("http://localhost:8081/inventory");
        const items = Array.isArray(res.data) ? res.data : [];

        const lowStockCount = items.reduce((acc, it) => {
          return acc + (isLowStock(it.item, Number(it.quantity), it.unit) ? 1 : 0);
        }, 0);

        setInventorySummary({ totalItems: items.length, lowStock: lowStockCount });
      } catch (err) {
        console.error("Error fetching inventory:", err);
        setInventorySummary({ totalItems: 0, lowStock: 0 });
      } finally {
        setInventoryLoading(false);
      }
    };
    fetchInventory();
  }, []);

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

  const categoryOptions = {
    title: "Sales by Product Category",
    pieHole: 0.4,
    backgroundColor: "transparent",
    legend: { position: "right" },
  };

  const barOptions = {
    title: "Sales Over Time",
    backgroundColor: "transparent",
    legend: { position: "none" },
    colors: ["#8b5cf6"],
    hAxis: { textStyle: { color: "#6b7280" } },
    vAxis: { textStyle: { color: "#6b7280" } },
  };

  function isLowStock(item, quantity, unit) {
    const lower = String(item || "").toLowerCase();
    if (
      lower.includes("rice") ||
      lower.includes("tapa") ||
      lower.includes("bangus") ||
      lower.includes("chicken") ||
      lower.includes("lechon") ||
      lower.includes("pulpo") ||
      lower.includes("beef") ||
      lower.includes("pork") ||
      lower.includes("broccoli") ||
      lower.includes("vegetable") ||
      lower.includes("garlic") ||
      lower.includes("onion")
    ) {
      return quantity < 10;
    } else if (
      lower.includes("syrup") ||
      lower.includes("mix") ||
      lower.includes("sauce") ||
      lower.includes("mayonnaise") ||
      lower.includes("ketchup") ||
      lower.includes("gravy") ||
      lower.includes("juice") ||
      lower.includes("lemonade")
    ) {
      return quantity < 5;
    } else if (unit === "pcs" && quantity < 20) {
      return true;
    } else if (unit === "cans" && quantity < 20) {
      return true;
    } else if (unit === "bottles" && quantity < 20) {
      return true;
    }
    return false;
  }

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
              {metricsLoading ? "Loading..." : `₱ ${Number(metrics.totalSales || 0).toLocaleString()}`}
            </p>
            <div className="stat-subdetails">
              <span>Cash: ₱ {Number(metrics.paymentBreakdown?.cash || 0).toLocaleString()}</span>
              <span>GCash: ₱ {Number(metrics.paymentBreakdown?.gcash || 0).toLocaleString()}</span>
            </div>
            <PhilippinePesoIcon className="stat-icon" size={32} />
          </div>

          <div className="stat-card blue-gradient">
            <p className="stat-label">Orders</p>
            <p className="stat-value">
              {metricsLoading ? "Loading..." : Number(metrics.ordersCount || 0).toLocaleString()}
            </p>
            <div className="stat-subdetails">
              <span>Dine-in: {Number(metrics.orderBreakdown?.dine_in || 0).toLocaleString()}</span>
              <span>Takeout: {Number(metrics.orderBreakdown?.takeout || 0).toLocaleString()}</span>
            </div>
            <ShoppingCart className="stat-icon" size={32} />
          </div>

          <div className="stat-card gray-gradient">
            <p className="stat-label">Inventory</p>
            <p className="stat-value">
              {inventoryLoading
                ? "Loading..."
                : `${inventorySummary.totalItems} items`}
            </p>
            <div className="stat-subdetails">
              <span>Low stock: {inventorySummary.lowStock}</span>
            </div>
            <Package className="stat-icon" size={32} />
          </div>
        </div>

        <div className="charts-grid">
          <div className="chart-card">
            <div className="chart-header">
              <p className="chart-title">Sales Over Time</p>
              <select
                className="period-select"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <Chart
              chartType="ColumnChart"
              data={metrics.barSeries}
              options={barOptions}
              width="100%"
              height="300px"
            />
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <p className="chart-title">Sales by Category</p>
            </div>
            <Chart
              chartType="PieChart"
              data={metrics.pieSeries}
              options={categoryOptions}
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
