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
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("name");
    const userRole = localStorage.getItem("role");
    const userFirstName = localStorage.getItem("first_name");

    if (!token) {
      navigate("/");
    } else {
      setName(userName || "");
      setRole(userRole || "");
      setFirstName(userFirstName || "");
    }
  }, [navigate, location.pathname]);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.replace("/");
  };

  if (role === "owner")
    return <OwnerSidebar name={name} first_name={firstName} onLogout={handleLogout} />;
  if (role === "staff")
    return <StaffSidebar name={name} first_name={firstName} onLogout={handleLogout} />;

  return null;
}

export default Sidebar;
