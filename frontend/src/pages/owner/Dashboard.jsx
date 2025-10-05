import React, { useState } from 'react';
import { TrendingUp, Package, ShoppingCart, PieChart, Clock, PhilippinePesoIcon} from 'lucide-react';
import '../../Style/Dashboard.css';

const Dashboard = () => {
  const [selectedDateRange, setSelectedDateRange] = useState('Current Week');

  // Static data for now
  const salesData = [
    { month: 'Jan', value: 12 },
    { month: 'Feb', value: 19 },
    { month: 'Mar', value: 15 },
    { month: 'Apr', value: 17 },
    { month: 'May', value: 12 },
    { month: 'Jun', value: 25 },
    { month: 'Jul', value: 18 },
    { month: 'Aug', value: 30 }
  ];

  const productCategories = [
    { name: 'MONTHLY BILING SAMA', amount: '₱ 1,990,009,999,999', percentage: '65%', color: 'purple' },
    { name: 'Previous month', amount: '₱ 1,990,009,999', percentage: '25%', color: 'blue' },
    { name: 'Other', amount: '₱ 500,000', percentage: '10%', color: 'pink' }
  ];

  // Format current date
  const currentDate = new Date();
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="dashboard-container">
      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="header">
          <div className="header-content">
            <div className="live-clock">
              <Clock className="clock-icon" size={20} />
              <span className="time-display">{formatTime(currentDate)}</span>
            </div>
            <div className="header-right">
              <div className="dashboard-info">
                <p className="dashboard-title">Dashboard</p>
                <p className="dashboard-date">{formatDate(currentDate)}</p>
                <div className="live-indicator">
                  <span className="live-dot"></span>
                  <span className="live-text">Live</span>
                </div>
              </div>
              <div className="dashboard-icon">
                <PieChart className="icon-purple" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card yellow-gradient">
              <div className="stat-content">
                <div className="stat-info">
                  <p className="stat-label">Total Sales</p>
                  <p className="stat-value">₱ 123,102</p>
                </div>
                <PhilippinePesoIcon className="stat-icon yellow-icon" size={32} />
              </div>
            </div>

            <div className="stat-card blue-gradient">
              <div className="stat-content">
                <div className="stat-info">
                  <p className="stat-label">Orders</p>
                  <p className="stat-value">103</p>
                </div>
                <ShoppingCart className="stat-icon blue-icon" size={32} />
              </div>
            </div>

            <div className="stat-card pink-gradient">
              <div className="stat-content">
                <div className="stat-info">
                  <p className="stat-label">Revenue</p>
                  <p className="stat-value">₱ 501,200</p>
                </div>
                <TrendingUp className="stat-icon pink-icon" size={32} />
              </div>
            </div>

            <div className="stat-card gray-gradient">
              <div className="stat-content">
                <div className="stat-info">
                  <p className="stat-label">Products</p>
                  <p className="stat-value">1,247</p>
                </div>
                <Package className="stat-icon gray-icon" size={32} />
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="charts-grid">
            {/* Sales Analytics */}
            <div className="sales-analytics-card">
              <div className="analytics-header">
                <h3 className="analytics-title">Sales Analytics</h3>
                <div className="analytics-controls">
                  <select
                    value={selectedDateRange}
                    onChange={(e) => setSelectedDateRange(e.target.value)}
                    className="date-select"
                  >
                    <option>Current Range</option>
                    <option>Current Week</option>
                    <option>Current Month</option>
                    <option>Current Year</option>
                  </select>
                  <div className="suggestions">
                    <span>suggest April</span>
                    <span>suggest May</span>
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div className="chart-container">
                <svg className="chart-svg" viewBox="0 0 600 200">
                  {/* Grid lines */}
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <line
                      key={i}
                      x1="50"
                      y1={40 + i * 25}
                      x2="550"
                      y2={40 + i * 25}
                      stroke="#f0f0f0"
                      strokeWidth="1"
                    />
                  ))}
                  
                  {/* Y-axis labels */}
                  {[50, 40, 30, 20, 10, 0].map((value, i) => (
                    <text
                      key={i}
                      x="40"
                      y={45 + i * 25}
                      fontSize="10"
                      fill="#666"
                      textAnchor="end"
                    >
                      {value}
                    </text>
                  ))}

                  {/* Line chart */}
                  <polyline
                    points={salesData.map((item, i) => `${80 + i * 60},${165 - item.value * 4}`).join(' ')}
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Data points */}
                  {salesData.map((item, i) => (
                    <circle
                      key={i}
                      cx={80 + i * 60}
                      cy={165 - item.value * 4}
                      r="4"
                      fill="#8b5cf6"
                    />
                  ))}

                  {/* X-axis labels */}
                  {salesData.map((item, i) => (
                    <text
                      key={i}
                      x={80 + i * 60}
                      y="185"
                      fontSize="10"
                      fill="#666"
                      textAnchor="middle"
                    >
                      {item.month}
                    </text>
                  ))}
                </svg>
              </div>

              <div className="pie-charts">
                <div className="pie-chart">
                  <svg className="pie-svg" viewBox="0 0 42 42">
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#e2e8f0" strokeWidth="3" />
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#8b5cf6" strokeWidth="3" strokeDasharray="65 35" strokeDashoffset="25" />
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#3b82f6" strokeWidth="3" strokeDasharray="25 75" strokeDashoffset="-40" />
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f59e0b" strokeWidth="3" strokeDasharray="10 90" strokeDashoffset="-65" />
                  </svg>
                </div>
                <div className="pie-chart">
                  <svg className="pie-svg" viewBox="0 0 42 42">
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#e2e8f0" strokeWidth="3" />
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#8b5cf6" strokeWidth="3" strokeDasharray="70 30" strokeDashoffset="25" />
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#3b82f6" strokeWidth="3" strokeDasharray="20 80" strokeDashoffset="-45" />
                    <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#ec4899" strokeWidth="3" strokeDasharray="10 90" strokeDashoffset="-65" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Sales by Product Category */}
            <div className="category-card">
              <h3 className="category-title">Sales by Product Category</h3>
              
              <div className="categories-list">
                {productCategories.map((category, index) => (
                  <div key={index} className="category-item">
                    <div className="category-info">
                      <div className="category-details">
                        <p className="category-name">{category.name}</p>
                        <p className="category-amount">{category.amount}</p>
                      </div>
                      <div className={`category-percentage ${category.color}-bg`}>
                        {category.percentage}
                      </div>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className={`progress-fill ${category.color}-bg`} 
                        style={{ width: category.percentage }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
