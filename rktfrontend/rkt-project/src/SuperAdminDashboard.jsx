import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SuperAdminDashboard.css";

const SuperAdminDashboard = () => {
  const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
  const [organizations, setOrganizations] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [onboardData, setOnboardData] = useState({
    org_name: "",
    jde_ais_url: "",
    jde_env: "DV920",
    admin_name: "",
    admin_email: "",
  });

  const [configModal, setConfigModal] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [activeModules, setActiveModules] = useState({
    sales: false,
    inventory: false,
    procurement: false,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const authHeaders = { Authorization: `Bearer ${token}` };
      const [orgRes, userRes] = await Promise.all([
        axios.get("http://localhost:8080/api/superadmin/organizations", {
          headers: authHeaders,
        }),
        axios.get("http://localhost:8080/api/superadmin/users/all", {
          headers: authHeaders,
        }),
      ]);

      setOrganizations(orgRes.data);
      setUsers(userRes.data);
    } catch (err) {
      console.error("Fetch Error:", err.response?.status);
    }
  };

  const handleOnboard = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); // Get fresh token
    try {
      await axios.post(
        "http://localhost:8080/api/superadmin/organizations/onboard",
        onboardData,
        { headers: { Authorization: `Bearer ${token}` } }, // Use fresh token
      );
      setShowModal(false);
      fetchData();
    } catch (err) {
      alert("Failed to onboard organization and admin");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this client?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(
          `http://localhost:8080/api/superadmin/organizations/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        // Refresh the list after deleting
        fetchData();
      } catch (err) {
        alert("Failed to delete organization");
      }
    }
  };

  const handleModuleToggle = (module) => {
    setActiveModules((prev) => ({ ...prev, [module]: !prev[module] }));
  };

  const openConfig = async (org) => {
    setSelectedOrg(org);
    try {
      const token = localStorage.getItem("token");
      // Fetch currently enabled modules for this specific org
      const res = await axios.get(
        `http://localhost:8080/api/superadmin/organizations/${org.id}/modules`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // Reset all to false, then enable what came from the backend
      const newStatus = { sales: false, inventory: false, procurement: false };
      res.data.forEach((moduleName) => {
        newStatus[moduleName.toLowerCase()] = true;
      });

      setActiveModules(newStatus);
      setConfigModal(true);
    } catch (err) {
      console.error("Error fetching module config:", err);
      // Fallback: just open the modal with false values
      setActiveModules({ sales: false, inventory: false, procurement: false });
      setConfigModal(true);
    }
  };

  const saveConfig = async () => {
    try {
      const token = localStorage.getItem("token");
      // Convert our object {sales: true} into a list ["SALES"] for the backend
      const enabledModulesList = Object.keys(activeModules)
        .filter((key) => activeModules[key])
        .map((key) => key.toUpperCase());

      await axios.post(
        `http://localhost:8080/api/superadmin/organizations/${selectedOrg.id}/modules`,
        enabledModulesList,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setConfigModal(false);
      alert(`Configuration Saved for ${selectedOrg.orgName}!`);
    } catch (err) {
      alert("Failed to save config");
    }
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>RishiKirsti Control Center</h1>
        <p>Superadmin Portal - Global View</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-value">{organizations.length}</span>
          <span className="stat-label">Total Managed Clients</span>
        </div>
        <div className="stat-card">
          <span className="stat-value status-active">Active</span>
          <span className="stat-label">System Status</span>
        </div>
      </div>

      <section className="factory-section">
        <h3>Module Factory</h3>
        <p className="subtitle">
          Define templates once, deploy to multiple clients.
        </p>
        <div className="badge-group">
          <span className="badge-template">Sales Order Template</span>
          <span className="badge-template">Inventory Template</span>
          <span className="badge-template">Purchase Order Template</span>
        </div>
      </section>

      <section className="directory-section">
        <div className="section-header">
          <h3>Company Directory (Infrastructure)</h3>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            + Add Client & Admin
          </button>
        </div>

        <div className="org-list">
          {organizations.map((org) => (
            <div key={org.id} className="org-item">
              <div className="org-info">
                <strong>{org.orgName}</strong>
                <span className="org-url">{org.jdeAisUrl}</span>
                <span className="badge-env">{org.jdeEnv}</span>
              </div>
              <div className="org-actions">
                <button
                  className="btn-secondary"
                  onClick={() => openConfig(org)}
                >
                  Module Config
                </button>
                <button
                  className="btn-outline-danger"
                  onClick={() => handleDelete(org.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="user-section">
        <h3>Global User Directory</h3>
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Email</th>
                <th>Company</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.company || "N/A"}</td>
                  <td>
                    <span className="badge-role">{user.roles?.[0]}</span>
                  </td>
                  <td>
                    <button className="btn-manage">Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Onboard New Client</h3>
            <form onSubmit={handleOnboard}>
              <div className="form-group">
                <label>Company Details</label>
                <input
                  placeholder="Company Name"
                  onChange={(e) =>
                    setOnboardData({ ...onboardData, org_name: e.target.value })
                  }
                  required
                />

                <select
                  className="modal-select"
                  value={onboardData.jde_env}
                  onChange={(e) =>
                    setOnboardData({ ...onboardData, jde_env: e.target.value })
                  }
                >
                  <option value="DV920">Development (DV920)</option>
                  <option value="PY920">Testing/Prototype (PY920)</option>
                  <option value="PD920">Production (PD920)</option>
                </select>

                <input
                  placeholder="JDE AIS URL"
                  onChange={(e) =>
                    setOnboardData({
                      ...onboardData,
                      jde_ais_url: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Assign Org Admin</label>
                <input
                  placeholder="Admin Full Name"
                  onChange={(e) =>
                    setOnboardData({
                      ...onboardData,
                      admin_name: e.target.value,
                    })
                  }
                  required
                />
                <input
                  placeholder="Admin Email"
                  onChange={(e) =>
                    setOnboardData({
                      ...onboardData,
                      admin_email: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn-primary">
                  Complete Onboarding
                </button>
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {configModal && (
        <div className="modal-overlay">
          <div className="modal-content config-modal">
            <h3>Module Configuration</h3>
            <p className="subtitle">
              Enable/Disable JDE features for{" "}
              <strong>{selectedOrg?.orgName}</strong>
            </p>

            <div className="module-toggle-list">
              {["sales", "inventory", "procurement"].map((mod) => (
                <div key={mod} className="module-row">
                  <span className="module-name">
                    {mod.charAt(0).toUpperCase() + mod.slice(1)} Module
                  </span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={activeModules[mod]}
                      onChange={() => handleModuleToggle(mod)}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              ))}
            </div>

            <div className="modal-actions">
              <button onClick={saveConfig} className="btn-primary">
                Save Changes
              </button>
              <button
                onClick={() => setConfigModal(false)}
                className="btn-ghost"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;
