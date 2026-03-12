import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [credentials, setCredentials] = useState({ name: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
  e.preventDefault();
  
  // LOG EXACTLY WHAT IS GOING INTO THE STRINGIFY
  console.log("Username value:", credentials.username);
  console.log("Name value:", credentials.name);

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // FORCE the keys to match your Java AuthRequest.java fields
        body: JSON.stringify({
          name: credentials.name || credentials.username, // Try both state names
          password: credentials.password,
        }),
      });

      if (response.ok) {
        const data = await response.json(); // This will now work!

        // Save data for the ProtectedRoute in App.js
        localStorage.setItem("token", data.token);
        localStorage.setItem("user_role", data.role); // e.g., "ROLE_USER"
        localStorage.setItem("user", JSON.stringify(data));

        navigate("/integration");
      } else {
        const errorMsg = await response.text();
        alert(errorMsg);
      }
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <img src="./image.jpeg" alt="logo" className="imglogo" />
          <h2>Sign In</h2>
          <p>Access your enterprise integration portal</p>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label>Username</label>
            <input
              name="name"
              type="text"
              placeholder="Username"
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Sign In
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="signup-link">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
