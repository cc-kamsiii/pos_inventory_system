import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import Dashboard from "./pages/owner/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import Inventory from "./pages/owner/Inventory.jsx";
import "./Style/App.css";

function Layout() {
  const location = useLocation();
  const hideSidebar = location.pathname === "/"; // hide sidebar in login

  if (hideSidebar) {
    return (
      <div className="full-layout">
        <div className="full-content">
          <Routes>
            <Route path="/" element={<Login />} />
          </Routes>
        </div>
      </div>
    );
  }

  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
