import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. IMPORT THIS
import './Integration.css';

const Integration = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedERP, setSelectedERP] = useState(null);
  const [connectedSystems, setConnectedSystems] = useState([]);
  
  // 2. INITIALIZE NAVIGATE
  const navigate = useNavigate(); 
  
  const [config, setConfig] = useState({
    username: 'demo_user', 
    password: 'demo_pass123',
    env: 'DV920', 
    role: '*ALL'
  });

  useEffect(() => {
    const savedToken = localStorage.getItem('jde_token');
    if (savedToken) {
      setConnectedSystems(['jde']);
    }
  }, []);

  const erpSystems = [
    {
      id: 'jde',
      name: 'JD Edwards EnterpriseOne',
      logo: 'JDE',
      description: 'Connect to AIS Server to trigger Orchestrations for Sales, Inventory, and Finance.',
      features: ['Inventory Check', 'Sales Order Entry', 'Orchestrator Logs']
    },
    {
      id: 'sap',
      name: 'SAP S/4HANA',
      logo: 'SAP',
      description: 'Access global procurement and financial reporting via OData and RFC services.',
      features: ['Purchase Orders', 'OData Services', 'Financial Reporting']
    }
  ];

  const handleConfigure = (erp) => {
    setSelectedERP(erp);
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setConfig({ ...config, [name]: value });
  };

  const handleDisconnect = (id) => {
    if (id === 'jde') {
      localStorage.removeItem('jde_token');
      localStorage.removeItem('jde_env');
      localStorage.removeItem('jde_role');
    }
    setConnectedSystems(prev => prev.filter(systemId => systemId !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
      username: config.username,
      password: config.password,
      environment: config.env
    };
    
    try {
      // NOTE: For offline demo, you can bypass this fetch block
      const response = await fetch('http://localhost:8080/api/jde/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        
        // Save session data
        localStorage.setItem('jde_token', data.token);
        localStorage.setItem('jde_env', config.env);
        localStorage.setItem('jde_role', config.role);

        setConnectedSystems(prev => [...prev, selectedERP.id]);
        setShowModal(false);
        
        // 3. USE NAVIGATE HERE
        alert(`Connected Successfully!`);
        navigate('/jde-services'); 
        
      } else {
        alert("Connection failed. Check your demo credentials.");
      }
    } catch (error) {
      // OFFLINE FALLBACK: If backend isn't running, still allow demo navigation
      console.warn("Backend not detected, using demo bypass.");
      localStorage.setItem('jde_token', 'demo-token');
      localStorage.setItem('jde_env', config.env);
      localStorage.setItem('jde_role', config.role);
      navigate('/jde-services');
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="logo-container">
    <img src="image.jpeg" alt="Logo" className="logo-image" />
  </div>
        <nav>
          <div className="nav-item active">Integrations</div>
          <div className="nav-item">System Logs</div>
          <div className="nav-item">User Management</div>
        </nav>
      </aside>

      <main className="main-content">
        <header className="content-header">
          <h1>Connect Your Enterprise Systems</h1>
          <p>Access authorized services by logging into your JDE or SAP environments.</p>
        </header>

        <section className="card-grid">
          {erpSystems.map((erp) => {
            const isConnected = connectedSystems.includes(erp.id);
            return (
              <div key={erp.id} className={`erp-card ${isConnected ? 'connected-card' : ''}`}>
                <div className="card-top">
                  <div className="erp-logo-box">{erp.logo}</div>
                  <span className={`status-badge ${isConnected ? 'online' : 'offline'}`}>
                    {isConnected ? 'Connected' : 'Not Configured'}
                  </span>
                </div>
                <h3>{erp.name}</h3>
                <p>{erp.description}</p>
                <div className="feature-tags">
                  {erp.features.map(f => <span key={f} className="tag">{f}</span>)}
                </div>
                
                {isConnected ? (
                  <button className="disconnect-btn" onClick={() => handleDisconnect(erp.id)}>
                    Disconnect System
                  </button>
                ) : (
                  <button className="configure-btn" onClick={() => handleConfigure(erp)}>
                    Login & Connect
                  </button>
                )}
              </div>
            );
          })}
        </section>
      </main>

      {/* Modal logic remains the same... */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{selectedERP.name} Login</h2>
            <form onSubmit={handleSubmit} className="setup-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Username</label>
                  <input type="text" name="username" value={config.username} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input type="password" name="password" value={config.password} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>{selectedERP.id === 'jde' ? 'Environment' : 'Client ID'}</label>
                  <select name="env" value={config.env} className="custom-select" onChange={handleInputChange}>
                      <option value="DV920">Development (DV920)</option>
                      <option value="PY920">Prototype (PY920)</option>
                      <option value="PD920">Production (PD920)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>{selectedERP.id === 'jde' ? 'Role' : 'System Number'}</label>
                  <input type="text" name="role" value={config.role} onChange={handleInputChange} />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="save-btn">Verify & Connect</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Integration;