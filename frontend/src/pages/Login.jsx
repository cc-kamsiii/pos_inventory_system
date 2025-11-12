import "../Style/Login.css";
import logo from "../assets/logo.jpg";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UserNotLoggedIn from "./UserNotLoggedIn";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotUsername, setForgotUsername] = useState("");
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, { username, password });
      if (res.data.success) {
        const role = (res.data.role || "").toLowerCase();
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("name", res.data.name);
        localStorage.setItem("role", role);
        localStorage.setItem("user_id", res.data.user_id);
        localStorage.setItem("username", username);
        localStorage.setItem("first_name", res.data.first_name);
        localStorage.setItem("loginTime", new Date().toISOString());

        if (role === "owner") navigate("/dashboard", { replace: true });
        else if (role === "staff") navigate("/stafftransactions", { replace: true });
        else navigate("/", { replace: true });
      } else {
        setShowModal(true);
      }
    } catch (err) {
      console.log(err);
      alert("SERVER ERROR");
    }
  };


  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-left">
          <img src={logo} alt="Logo" className="login-logo" />
          <h2 className="system-title">P.O.S & Inventory System</h2>
        </div>

        <div className="login-right">
          <form onSubmit={handleSubmit} className="login-form">
            <h3 className="login-title">Welcome Back</h3>
            <p className="login-subtitle">Enter your credentials to log in</p>

            <input
              type="text"
              placeholder="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit" className="login-btn">Log In</button>

          </form>
        </div>
      </div>

      <UserNotLoggedIn isVisible={showModal} onClose={() => setShowModal(false)} />

      {showForgotModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Reset Password</h3>
            <p>Enter your username to receive a reset link</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
