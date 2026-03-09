import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./SignUp.css";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    username: "", // Matches your backend 'name' field
    email: "",
    phone: "",
    company: "",
    password: "",
    roles: ["ROLE_USER"], // Default role
  });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsError(false);
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        formData,
      );
      setMessage(response.data);
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      setIsError(true);
      setMessage("Registration failed. Please check your backend connection.");
    }
  };

  return (
    // Inside your SignUp.jsx return:
    <div className="signup-container">
      <h2 className="signup-title">Create Account</h2>
      <form onSubmit={handleSubmit} className="form-grid">
        <div className="input-group">
          <label>Full Name</label>
          <input type="text" name="fullName" onChange={handleChange} required />
        </div>
        <div className="input-group">
          <label>Username</label>
          <input type="text" name="username" onChange={handleChange} required />
        </div>
        <div className="input-group">
          <label>Email</label>
          <input type="email" name="email" onChange={handleChange} required />
        </div>
        <div className="input-group">
          <label>Phone</label>
          <input type="text" name="phone" onChange={handleChange} required />
        </div>
        <div className="input-group">
          <label>Company</label>
          <input type="text" name="company" onChange={handleChange} required />
        </div>
        <div className="input-group full-width">
          <label>Password</label>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="signup-button">
          Register
        </button>

        <div className="auth-footer">
          Already have an account?{" "}
          <Link to="/" className="auth-link">
            Sign In
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
