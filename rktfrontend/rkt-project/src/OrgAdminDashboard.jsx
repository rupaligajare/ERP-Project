import React, { useState, useEffect } from "react";
import axios from "axios";
import "./OrgAdminDashboard.css";

const OrgAdminDashboard = () => {
  const [companyInfo, setCompanyInfo] = useState(null);
  const [enabledModules, setEnabledModules] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  
  const companyName = localStorage.getItem("company"); // Saved during login
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchOrgData();
  }, []);

  const fetchOrgData = async () => {
    try {
      // 1. Fetch this specific company's details & modules
      const res = await axios.get(`http://localhost:8080/api/client/details`, { headers });
      setCompanyInfo(res.data.organization);
      setEnabledModules(res.data.modules); // Returns list like ["SALES", "INVENTORY"]
      setTeamMembers(res.data.users);
    } catch (err) {
      console.error("Failed to load dashboard", err);
    }
  };

  return (
    <div className="org-container">
      <header className="org-header">
        <h1>{companyName} Dashboard</h1>
        <div className="env-tag">{companyInfo?.jdeEnv} Environment</div>
      </header>

      <section className="module-grid">
        <h3>My JDE Modules</h3>
        <div className="cards-container">
          {enabledModules.map((mod) => (
            <div key={mod} className="module-card">
              <div className="icon">🚀</div>
              <h4>{mod} Module</h4>
              <button className="btn-launch">Launch App</button>
            </div>
          ))}
          {enabledModules.length === 0 && <p>No modules enabled. Contact RishiKirsti Support.</p>}
        </div>
      </section>

      <section className="team-section">
        <h3>My Team ({companyName})</h3>
        <table className="team-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {teamMembers.map((user) => (
              <tr key={user.id}>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>{user.roles[0].replace('ROLE_', '')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default OrgAdminDashboard;