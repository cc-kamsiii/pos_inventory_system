import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import Dashboard from "./pages/owner/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import Inventory from "./pages/owner/Inventory.jsx";
import Add from "./pages/owner/crud/Add.jsx";
import Read from "./pages/owner/crud/Read.jsx";
import Edit from "./pages/owner/crud/Edit.jsx";
import POS from "./pages/staff/POS.jsx";
import StaffTransactions from "./pages/staff/Stafftransactions.jsx";
import OwnerTransactions from "./pages/owner/OwnerTransactions.jsx";
import Settings from "./pages/owner/Settings.jsx";
import EditAcc from "./pages/owner/EditAcc.jsx";
import EditMenu from "./pages/owner/EditMenu.jsx";
import LockScreen from "./components/LockScreen.jsx";
import "./Style/App.css";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function Layout() {
  const location = useLocation();
  const hideSidebar = location.pathname === "/";

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
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <Inventory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <Add />
              </ProtectedRoute>
            }
          />
          <Route
            path="/read/:id"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <Read />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <Edit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ownertransactions"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <OwnerTransactions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editacc"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <EditAcc />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editmenu"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <EditMenu />
              </ProtectedRoute>
            }
          />

          <Route
            path="/pos"
            element={
              <ProtectedRoute allowedRoles={["staff"]}>
                <POS />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stafftransactions"
            element={
              <ProtectedRoute allowedRoles={["staff"]}>
                <StaffTransactions />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  const [isLocked, setIsLocked] = useState(
    localStorage.getItem("isLocked") === "true"
  );

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "staff") return;

    let timer;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setIsLocked(true);
        localStorage.setItem("isLocked", "true"); 
      }, 2 * 60 * 1000); 
    };

    const events = ["mousemove", "keypress", "click"];
    events.forEach((e) => window.addEventListener(e, resetTimer));

    resetTimer();

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimer));
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
  const currentPath = window.location.pathname;

  if (currentPath === "/") {
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = () => {
      window.history.go(1);
    };
  } else {
    window.onpopstate = null;
  }
}, [window.location.pathname]);


  const handleUnlock = () => {
    setIsLocked(false);
    localStorage.removeItem("isLocked");
  };

  if (isLocked) {
    return <LockScreen onUnlock={handleUnlock} />;
  }

  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
