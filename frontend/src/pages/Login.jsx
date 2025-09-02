import "../Style/Login.css";
import logo from "../assets/logo.jpg";
import { useState} from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function Login() {


  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) =>{
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:8081/auth/login', {username, password});

      if(res.data.success){
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("name", res.data.name)
        localStorage.setItem("role", res.data.role); 
        navigate("/Dashboard")
      }
      else{
        alert(res.data.message);
      }
    } catch (err) {
        console.log(err);
        alert("SERVER ERROR");
    }
  }

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <img src={logo} width="200" className="logo" />
        <div className="head">
          <h1>Login</h1>
        </div>

        <div className="inputs">
            <div className="input">
              <input type="text" placeholder="Username" required onChange={(e) => setUsername(e.target.value)} />
            </div>

            <div className="input">
              <input type="password" placeholder="Password" required  onChange={(e) => setPassword(e.target.value)}/>
            </div>
            
        </div>

        <div className="Sub-Cont">
          <button type="submit" className="Submit">Login</button>
        </div>

      </form>

    </div>
  );
}

export default Login;