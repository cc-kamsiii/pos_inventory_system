import "../Style/Login.css";
import logo from "../assets/logo.jpg"; 
import sisig from "../assets/sisig.jpg"
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8081/auth/login", {
        username,
        password,
      });

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("name", res.data.name);
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("user_id", res.data.user_id); 

        console.log("Stored in localStorage:", {
          name: res.data.name,
          role: res.data.role,
          user_id: res.data.user_id
        });
        navigate("/Dashboard");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.log(err);
      alert("SERVER ERROR");
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <img src={logo} alt="Logo" className="login-logo" />
        <h2>P.O.S and Inventory Management System</h2>
      </div>

      <div className="login-right">
        <form onSubmit={handleSubmit} className="login-form">
          <h3 className="login-title">Log in</h3>
          <p>Enter your credentials to continue</p>

          <input
            type="text"
            placeholder="Username"
            required
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="login-btn">
            Log in
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;