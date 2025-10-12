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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTotalSales = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8081/ownerTransactions/total_sales"
        );
        setTotalSales(res.data.total_sales);
      } catch (error) {
        console.error("Error fetching total sales:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTotalSales();
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

  const salesData = [
    ["Month", "Sales"],
    ["Jan", 12000],
    ["Feb", 19000],
    ["Mar", 15000],
    ["Apr", 17000],
    ["May", 12000],
    ["Jun", 25000],
    ["Jul", 18000],
    ["Aug", 30000],
  ];

  const salesOptions = {
    title: "Sales Analytics",
    curveType: "function",
    legend: { position: "bottom" },
    colors: ["#8b5cf6"],
    backgroundColor: "transparent",
  };

  const categoryData = [
    ["Category", "Amount"],
    ["Monthly Billing", 65],
    ["Previous Month", 25],
    ["Other", 10],
  ];

  const categoryOptions = {
    title: "Sales by Product Category",
    pieHole: 0.4,
    colors: ["#8b5cf6", "#3b82f6", "#f59e0b"],
    backgroundColor: "transparent",
    legend: { position: "right" },
  };

  const barData = [
    ["Month", "Revenue", { role: "style" }],
    ["Jan", 8000, "#8b5cf6"],
    ["Feb", 11000, "#3b82f6"],
    ["Mar", 9500, "#f472b6"],
    ["Apr", 15000, "#f59e0b"],
    ["May", 20000, "#10b981"],
  ];

  const barOptions = {
    title: "Monthly Revenue",
    backgroundColor: "transparent",
    legend: { position: "none" },
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
            <PhilippinePesoIcon className="stat-icon" size={32} />
          </div>

          <div className="stat-card blue-gradient">
            <p className="stat-label">Orders</p>
            <p className="stat-value">103</p>
            <ShoppingCart className="stat-icon" size={32} />
          </div>

          <div className="stat-card pink-gradient">
            <p className="stat-label">Revenue</p>
            <p className="stat-value">₱ 501,200</p>
            <TrendingUp className="stat-icon" size={32} />
          </div>

          <div className="stat-card gray-gradient">
            <p className="stat-label">Inventory</p>
            <p className="stat-value">1,247</p>
            <Package className="stat-icon" size={32} />
          </div>
        </div>

        <div className="charts-grid">
          <div className="chart-card">
            <Chart
              chartType="LineChart"
              data={salesData}
              options={salesOptions}
              width="100%"
              height="300px"
            />
          </div>

          <div className="chart-card">
            <Chart
              chartType="PieChart"
              data={categoryData}
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
