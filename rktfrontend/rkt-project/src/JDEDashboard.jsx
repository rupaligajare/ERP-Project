import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./JDEDashboard.css";

const JDEDashboard = () => {
  const navigate = useNavigate();

  // Static Demo Data (Role-Based Simulation)
  const demoServices = [
    {
      title: "Inventory",
      appId: "P41202",
      description: "Check real-time stock levels and item locations.",
    },
    {
      title: "Sales Orders",
      appId: "P4210",
      description: "Create and track customer sales orders.",
    },
    {
      title: "Finance",
      appId: "P0911",
      description: "View general ledger and financial reports.",
    },
    {
      title: "Procurement",
      appId: "P4310",
      description: "Manage purchase requisitions and approvals.",
    },
  ];

  const handleDisconnect = () => {
    localStorage.removeItem("token"); // Clear login session
    navigate("/"); // Redirect to login page
  };

  return (
    <div className="jde-dashboard-container">
      {/* Sidebar with Disconnect Option on the Left */}
      <aside className="jde-sidebar">
        <div className="sidebar-header">
          <img src="image.jpeg" alt="Logo" className="sidebar-logo" />
          <h3 className="sidebar-title">ERP Control</h3>
        </div>
        <nav className="sidebar-nav">
          <div className="sidebar-item active">📊 Dashboard</div>
          <div className="sidebar-item">⚙️ Settings</div>

          {/* Disconnect Option at the bottom of the Sidebar */}
          <div className="sidebar-footer">
            <button className="logout-btn" onClick={handleDisconnect}>
              🔌 Disconnect System
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="jde-main-content">
        <header className="content-header">
          <h1>JDE Service Catalog</h1>
          <p className="env-status">
            Environment: <strong>DV920 (Demo Mode)</strong>
          </p>
        </header>

        <div className="services-grid">
          {demoServices.map((service, index) => (
            <div key={index} className="service-card">
              <div className="card-header">
                <span className="app-tag">{service.appId}</span>
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            
                <button
                  className="launch-button"
                  onClick={() => {
                    if (service.appId === "P4210") navigate("/sales"); // P4210 is Sales appId
                    if (service.appId === "P41202") navigate("/inventory");
                  }}
                >
                  Open Module
                </button>
               
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default JDEDashboard;
