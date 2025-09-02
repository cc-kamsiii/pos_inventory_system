import React, { useEffect, useState } from "react";

function Dashboard() {
  const [name, setName] = useState("");

  useEffect(() => {
    const userName = localStorage.getItem("name");
    setName(userName || "Unknown");
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, your role is <strong>{name}</strong></p>
    </div>
  );
}

export default Dashboard;
