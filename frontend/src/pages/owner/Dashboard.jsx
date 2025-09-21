import React, { useEffect, useState } from "react";

function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      {user ? (
        <p>
          Welcome <strong>{user.name}</strong>, your role is{" "}
          <strong>{user.role}</strong>
        </p>
      ) : (
        <p>No user logged in</p>
      )}
    </div>
  );
}

export default Dashboard;
