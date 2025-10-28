import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Style/LockScreen.css";

function LockScreen({ onUnlock }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://192.168.1.56:8081";

  const handleUnlock = async () => {
    const username = localStorage.getItem("username");
    if (!username) {
      setError("Session expired. Please log in again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${API_BASE}/auth/login`, { username, password });

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        setPassword("");
        setError("");
        setLoading(false);
        onUnlock();
      } else {
        setError(res.data.message || "Wrong password");
        setLoading(false);
      }
    } catch (err) {
      console.error("Unlock error:", err);
      setError("Server not reachable or error occurred.");
      setLoading(false);
    }
  };

  // ✅ Detect Enter key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        handleUnlock();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [password]);

  return (
    <div className="lock-overlay">
      <div className="lock-box">
        <h2>Screen Locked</h2>
        <p className="lock-desc">Please enter your password to unlock</p>

        <input
          type="password"
          placeholder="Enter password..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleUnlock} disabled={loading}>
          {loading ? "Checking..." : "Unlock"}
        </button>

        {error && <p className="error-text">{error}</p>}
      </div>
    </div>
  );
}

export default LockScreen;
