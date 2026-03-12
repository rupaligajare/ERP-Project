import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Integration.css";

const Integration = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedERP, setSelectedERP] = useState(null);
  const [connectedSystems, setConnectedSystems] = useState([]);
  const navigate = useNavigate();

  // 1. CLEARED STATE: No more hardcoded demo credentials
  const [config, setConfig] = useState({
    username: "",
    password: "",
    env: "DV920",
  });

  useEffect(() => {
    const savedToken = localStorage.getItem("jde_token");
    if (savedToken) {
      setConnectedSystems(["jde"]);
    }
  }, []);

  const erpSystems = [
    {
      id: "jde",
      name: "JD Edwards EnterpriseOne",
      logo: "JDE",
      description:
        "Connect to AIS Server to trigger Orchestrations for Sales, Inventory, and Finance.",
      features: ["Inventory Check", "Sales Order Entry", "Orchestrator Logs"],
    },
    {
      id: "sap",
      name: "SAP S/4HANA",
      logo: "SAP",
      description:
        "Access global procurement and financial reporting via OData and RFC services.",
      features: ["Purchase Orders", "OData Services", "Financial Reporting"],
    },
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
    if (id === "jde") {
      localStorage.removeItem("jde_token");
      localStorage.removeItem("jde_env");
      localStorage.removeItem("user_role");
    }
    setConnectedSystems((prev) => prev.filter((systemId) => systemId !== id));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  const appToken = localStorage.getItem("token"); 

  try {
    const response = await fetch("http://localhost:8080/api/jde/connect", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${appToken}` 
      },
      body: JSON.stringify({
        username: config.username,
        password: config.password,
        environment: config.env
      }),
    });

    if (response.ok) {
      // IMPORTANT: Parse the response body first!
      const data = await response.json(); 

      // Save the JDE session token and the verified role
      localStorage.setItem("jde_token", data.token);
      localStorage.setItem("user_role", data.role);
      setConnectedSystems(["jde"]);
      setShowModal(false);

      // DYNAMIC ROUTING
      console.log("Navigating for role:", data.role);
      
      switch (data.role) {
        case "ROLE_SUPERADMIN":
          navigate("/superadmin/dashboard");
          break;
        case "ROLE_ORG_ADMIN":
        case "ROLE_ADMIN":
          navigate("/admin/dashboard");
          break;
        case "ROLE_USER":
          navigate("/jde-services"); 
          break;
        default:
          navigate("/integration");
      }
    } else if (response.status === 401) {
      alert("Unauthorized: Your JDE credentials or App session is invalid.");
    } else {
      const errorText = await response.text();
      alert("Error: " + errorText);
    }
  } catch (err) {
    console.error("Connection Error:", err);
    alert("Connection Error: Unable to reach the server.");
  }
};

  return (
    <div className="dashboard-container">
      {/* SIDEBAR REMAINS UNCHANGED */}
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
          <p>
            Access authorized services by logging into your JDE or SAP
            environments.
          </p>
        </header>

        <section className="card-grid">
          {erpSystems.map((erp) => {
            const isConnected = connectedSystems.includes(erp.id);
            return (
              <div
                key={erp.id}
                className={`erp-card ${isConnected ? "connected-card" : ""}`}
              >
                <div className="card-top">
                  <div className="erp-logo-box">{erp.logo}</div>
                  <span
                    className={`status-badge ${isConnected ? "online" : "offline"}`}
                  >
                    {isConnected ? "Connected" : "Not Configured"}
                  </span>
                </div>
                <h3>{erp.name}</h3>
                <p>{erp.description}</p>
                <div className="feature-tags">
                  {erp.features.map((f) => (
                    <span key={f} className="tag">
                      {f}
                    </span>
                  ))}
                </div>

                {isConnected ? (
                  <div className="button-group">
                    <button
                      className="configure-btn dashboard-btn"
                      onClick={() => {
                        const role = localStorage.getItem("user_role");
                        if (role === "ROLE_SUPERADMIN")
                          navigate("/superadmin/dashboard");
                        else if (role === "ROLE_ORG_ADMIN")
                          navigate("/admin/dashboard");
                        else navigate("/dashboard");
                      }}
                    >
                      Open Dashboard
                    </button>
                    <button
                      className="disconnect-btn"
                      onClick={() => handleDisconnect(erp.id)}
                    >
                      Disconnect System
                    </button>
                  </div>
                ) : (
                  <button
                    className="configure-btn"
                    onClick={() => handleConfigure(erp)}
                  >
                    Login & Connect
                  </button>
                )}
              </div>
            );
          })}
        </section>
      </main>

      {/* MODAL: DESIGN KEPT, ROLE INPUT DELETED */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{selectedERP.name} Login</h2>
            <form onSubmit={handleSubmit} className="setup-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Username</label>
                  <input
                    type="text"
                    name="username"
                    value={config.username}
                    onChange={handleInputChange}
                    placeholder="Enter JDE Username"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={config.password}
                    onChange={handleInputChange}
                    placeholder="Enter JDE Password"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Environment</label>
                  <select
                    name="env"
                    value={config.env}
                    className="custom-select"
                    onChange={handleInputChange}
                  >
                    <option value="DV920">Development (DV920)</option>
                    <option value="PY920">Prototype (PY920)</option>
                    <option value="PD920">Production (PD920)</option>
                  </select>
                </div>
                {/* EMPTY SPACE: This preserves your original design grid */}
                <div className="form-group"></div>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  Verify & Connect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Integration;
