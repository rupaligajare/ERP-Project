import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
    // We use 'name' here to match the Backend AuthRequest DTO
    const [credentials, setCredentials] = useState({ name: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Sends { "name": "...", "password": "..." }
            const response = await axios.post('http://localhost:8080/api/auth/login', credentials);
            localStorage.setItem('token', response.data);
            navigate('/dashboard');
        } catch (err) {
            setError("Invalid username or password");
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <img src="./image.jpeg" alt="logo" className='imglogo' />
                    <h2>Sign In</h2>
                    <p>Use your username to access your account</p>
                </div>
                
                {error && <div className="error-banner">{error}</div>}
                
                <form onSubmit={handleLogin} className="login-form">
                    <div className="input-group">
                        <label>Username</label>
                        <input 
                            name="name" 
                            type="text" 
                            placeholder="e.g. rupali_dev" 
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
                    
                    <button type="submit" className="login-btn">Sign In</button>
                </form>

                <div className="login-footer">
                    <p>Don't have an account? <Link to="/register" className="signup-link">Create Account</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;