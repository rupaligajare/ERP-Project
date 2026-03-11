import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [credentials, setCredentials] = useState({ name: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Detect if we are on the super-login route
  // Change this line in Login.js
  const isSuperAdminPath = window.location.pathname === "/super-login" || window.location.pathname === "/admin-login";

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

 const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post("http://localhost:8080/api/auth/login", credentials);
        
        // 1. Save the token
        localStorage.setItem("token", response.data);

        // 2. IMPORTANT: Create the user object your App.jsx needs
        // We know if they are on /super-login, they should be treated as ROLE_SUPERADMIN
        const userObj = {
            name: credentials.name,
            role: isSuperAdminPath ? "ROLE_SUPERADMIN" : "ROLE_USER"
        };
        localStorage.setItem("user", JSON.stringify(userObj));

        // 3. Navigate to the right dashboard
        if (isSuperAdminPath) {
            navigate("/superadmin/dashboard");
        } else {
            navigate("/dashboard");
        }
    } catch (err) {
        setError("Login failed. Check your password.");
    }
};

  return (
    <div className={`login-page ${isSuperAdminPath ? "admin-bg" : ""}`}>
      <div className="login-card">
        <div className="login-header">
          <img src="./image.jpeg" alt="logo" className="imglogo" />
          <h2>{isSuperAdminPath ? "Superadmin Sign In" : "Sign In"}</h2>
          <p>
            {isSuperAdminPath
              ? "Infrastructure Management"
              : "Use your username to access your account"}
          </p>
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

          <button
            type="submit"
            className={`login-btn ${isSuperAdminPath ? "admin-btn" : ""}`}
          >
            {isSuperAdminPath ? "Authorize Access" : "Sign In"}
          </button>
        </form>

        {!isSuperAdminPath && (
          <div className="login-footer">
            <p>
              Don't have an account?{" "}
              <Link to="/register" className="signup-link">
                Create Account
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
