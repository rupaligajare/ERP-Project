import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const JdeLoginModal = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: 'demo_user',
    password: 'demo_pass123', 
    environment: 'DV920'
  });
  const [status, setStatus] = useState('Disconnected');

  const handleLogin = async () => {
    setStatus('Connecting...');
    
    try {
      const response = await fetch('/api/jde/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json(); 
        // Backend should return: { token, role, department }
        // e.g., { role: 'USER', department: 'SALES' } or { role: 'ADMIN' }

        localStorage.setItem("jde_token", data.token);
        localStorage.setItem("active_env", formData.environment);
        localStorage.setItem("user_role", data.role);
        
        setStatus(`Connected to ${formData.environment}!`);

        // --- THE MASTER SWITCH LOGIC ---
        if (data.role === 'SUPERADMIN') {
          navigate('/superadmin/dashboard');
        } 
        else if (data.role === 'ADMIN') {
          navigate('/admin/dashboard');
        } 
        else {
          // It's a regular user, check their business function
          switch (data.department) {
            case 'SALES':
              navigate('/sales/dashboard');
              break;
            case 'PROCUREMENT':
              navigate('/procurement/dashboard');
              break;
            case 'INVENTORY':
              navigate('/inventory/inquiry');
              break;
            default:
              navigate('/dashboard'); // General fallback
          }
        }
      } else {
        setStatus('Connection Failed');
      }
    } catch (error) {
      setStatus('Server Error');
    }
  };

  return (
    <div className="login-card">
      <h2>KT Oracle Integration</h2>
      {/* ... your select and inputs ... */}
      <button onClick={handleLogin}>Verify & Connect</button>
      <p className={`status-text ${status.toLowerCase()}`}>{status}</p>
    </div>
  );
};