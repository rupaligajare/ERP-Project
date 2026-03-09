import React, { useState } from 'react';

export const JdeLoginModal = () => {
  const [formData, setFormData] = useState({
    username: 'demo_user', // Pre-filled for demo
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
        setStatus(`Connected to ${formData.environment}!`);
        // Save token and open the Inventory/Sales pages
        console.log("JDE Token:", data.token);
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
      
      <div className="input-group">
        <label>Select Environment</label>
        <select 
          value={formData.environment} 
          onChange={(e) => setFormData({...formData, environment: e.target.value})}
        >
          <option value="DV920">Development (DV920)</option>
          <option value="PY920">Testing (PY920)</option>
          <option value="PD920">Production (PD920)</option>
        </select>
      </div>

      <input 
        type="text" 
        placeholder="Username" 
        value={formData.username}
        onChange={(e) => setFormData({...formData, username: e.target.value})}
      />
      
      <input 
        type="password" 
        placeholder="Password" 
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
      />

      <button onClick={handleLogin}>Verify & Connect</button>
      
      <p className={`status-text ${status.toLowerCase()}`}>{status}</p>
    </div>
  );
};