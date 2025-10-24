import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Package, ShoppingCart, PhilippinePesoIcon } from "lucide-react";
import { Chart } from "react-google-charts";
import "../../Style/Dashboard.css";

const Dashboard = () => {
  // Range filter
  const [range, setRange] = useState("monthly"); // weekly | monthly | yearly

  // Analytics data
  const [analytics, setAnalytics] = useState({
    totals: { total_sales: 0, orders_count: 0 },
    payments: {
      cash: { total_sales: 0, orders_count: 0 },
      gcash: { total_sales: 0, orders_count: 0 },
      other: { total_sales: 0, orders_count: 0 },
    },
    orderTypes: { dine_in: 0, takeout: 0, other: 0 },
    bar: [],
  });
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  // Inventory data
  const [inventory, setInventory] = useState([]);
  const [loadingInventory, setLoadingInventory] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoadingAnalytics(true);
      try {
        const res = await axios.get(
          `http://localhost:8081/ownerTransactions/analytics?range=${range}`
        );
        setAnalytics(res.data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoadingAnalytics(false);
      }
    };
    fetchAnalytics();
  }, [range]);

  useEffect(() => {
    const fetchInventory = async () => {
      setLoadingInventory(true);
      try {
        const res = await axios.get("http://localhost:8081/inventory");
        setInventory(res.data || []);
      } catch (error) {
        console.error("Error fetching inventory:", error);
      } finally {
        setLoadingInventory(false);
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

  // Build charts from analytics
  const barData = useMemo(() => {
    const rows = (analytics.bar || []).map((b) => [b.label, Number(b.total_sales || 0)]);
    return [["Period", "Sales"], ...rows];
  }, [analytics]);

  const barOptions = useMemo(
    () => ({
      title: `Sales (${range.charAt(0).toUpperCase() + range.slice(1)})`,
      backgroundColor: "transparent",
      legend: { position: "none" },
      colors: ["#8b5cf6"],
      vAxis: { format: "short" },
    }),
    [range]
  );

  const pieData = useMemo(() => {
    const cash = Number(analytics.payments?.cash?.total_sales || 0);
    const gcash = Number(analytics.payments?.gcash?.total_sales || 0);
    const other = Number(analytics.payments?.other?.total_sales || 0);
    return [
      ["Payment Method", "Sales"],
      ["Cash", cash],
      ["GCash", gcash],
      ["Other", other],
    ];
  }, [analytics]);

  const pieOptions = {
    title: "Sales by Payment Method",
    pieHole: 0.4,
    colors: ["#8b5cf6", "#3b82f6", "#f59e0b"],
    backgroundColor: "transparent",
    legend: { position: "right" },
  };

  // Inventory derived stats
  const isLowStock = (item, quantity, unit) => {
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
      return Number(quantity) < 10;
    }
    if (
      lower.includes("syrup") ||
      lower.includes("mix") ||
      lower.includes("sauce") ||
      lower.includes("mayonnaise") ||
      lower.includes("ketchup") ||
      lower.includes("gravy") ||
      lower.includes("juice") ||
      lower.includes("lemonade")
    ) {
      return Number(quantity) < 5;
    }
    if (unit === "pcs" && Number(quantity) < 20) return true;
    if (unit === "cans" && Number(quantity) < 20) return true;
    if (unit === "bottles" && Number(quantity) < 20) return true;
    return false;
  };

  const totalInventoryItems = inventory.length;
  const totalLowStockItems = useMemo(
    () => inventory.filter((it) => isLowStock(it.item, it.quantity, it.unit)).length,
    [inventory]
  );

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
              <div className="dashboard-filters">
                <select value={range} onChange={(e) => setRange(e.target.value)}>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card yellow-gradient">
            <p className="stat-label">Total Sales</p>
            <p className="stat-value">
              {loadingAnalytics
                ? "Loading..."
                : `₱ ${Number(analytics.totals?.total_sales || 0).toLocaleString()}`}
            </p>
            <div className="stat-sub">
              <span>Cash: ₱ {Number(analytics.payments?.cash?.total_sales || 0).toLocaleString()}</span>
              <span>GCash: ₱ {Number(analytics.payments?.gcash?.total_sales || 0).toLocaleString()}</span>
            </div>
            <PhilippinePesoIcon className="stat-icon" size={32} /> 
          </div>

          <div className="stat-card blue-gradient">
            <p className="stat-label">Orders</p>
            <p className="stat-value">
              {loadingAnalytics ? "Loading..." : Number(analytics.totals?.orders_count || 0)}
            </p>
            <div className="stat-sub">
              <span>Dine-in: {Number(analytics.orderTypes?.dine_in || 0)}</span>
              <span>Takeout: {Number(analytics.orderTypes?.takeout || 0)}</span>
            </div>
            <ShoppingCart className="stat-icon" size={32} />
          </div>

          <div className="stat-card gray-gradient">
            <p className="stat-label">Inventory</p>
            <p className="stat-value">
              {loadingInventory ? "Loading..." : totalInventoryItems}
            </p>
            <div className="stat-sub">
              <span>Low stock: {loadingInventory ? "-" : totalLowStockItems}</span>
            </div>
            <Package className="stat-icon" size={32} />
          </div>
        </div>

        <div className="charts-grid">
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
            <Chart
              chartType="PieChart"
              data={pieData}
              options={pieOptions}
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
