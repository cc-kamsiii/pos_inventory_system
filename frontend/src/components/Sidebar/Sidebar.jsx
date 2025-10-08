import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import OwnerSidebar from "./OwnerSidebar";
import StaffSidebar from "./StaffSidebar";
import "../../Style/Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("name");
    const userRole = localStorage.getItem("role");

    if (!token) {
      navigate("/");
    } else {
      setName(userName || "");
      setRole(userRole || "");
    }
  }, [navigate, location.pathname]); 

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (role === "owner") return <OwnerSidebar name={name} onLogout={handleLogout} />;
  if (role === "staff") return <StaffSidebar name={name} onLogout={handleLogout} />;

  return null;
}

export default Sidebar;
