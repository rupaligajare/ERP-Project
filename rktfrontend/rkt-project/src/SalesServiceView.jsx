import React, { useEffect, useState } from "react";
import axios from "axios";
import "./JDEDashboard.css"; // Reusing your existing styles

const SalesServiceView = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve your saved token

        const response = await axios.get(
          "http://localhost:8080/api/sales/list",
          {
            params: { company: "Purepick" },
            headers: {
              Authorization: `Bearer ${token}`, // Send the token for the 403 to go away
            },
          },
        );
        setSalesData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching sales data", error);
        setLoading(false);
      }
    };
    fetchSales();
  }, []);

  return (
    <div className="jde-dashboard-container">
      {/* Sidebar - Reusing your existing sidebar structure */}
      <aside className="jde-sidebar">
        <div className="sidebar-header">
          <img src="image.jpeg" alt="Logo" className="sidebar-logo" />
          <h3 className="sidebar-title">Sales Portal</h3>
        </div>
        <nav className="sidebar-nav">
          <div className="sidebar-item" onClick={() => window.history.back()}>
            ⬅ Back to Catalog
          </div>
          <div className="sidebar-item active">📦 Sales Orders</div>
        </nav>
      </aside>

      <main className="jde-main-content">
        <header className="content-header">
          <h1>Sales Management</h1>
          <p>
            Company: <strong>Purepick</strong>
          </p>
        </header>

        {loading ? (
          <p>Loading Sales Orders...</p>
        ) : (
          <div className="erp-card" style={{ padding: "0" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left",
              }}
            >
              <thead style={{ background: "#f1f5f9" }}>
                <tr>
                  <th style={{ padding: "15px" }}>Order #</th>
                  <th style={{ padding: "15px" }}>Customer</th>
                  <th style={{ padding: "15px" }}>Amount</th>
                  <th style={{ padding: "15px" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {salesData.map((order) => (
                  <tr
                    key={order.id}
                    style={{ borderBottom: "1px solid #e2e8f0" }}
                  >
                    <td style={{ padding: "15px" }}>{order.orderNumber}</td>
                    <td style={{ padding: "15px" }}>{order.customerName}</td>
                    <td style={{ padding: "15px" }}>${order.amount}</td>
                    <td style={{ padding: "15px" }}>
                      <span
                        className={`status-badge ${order.status.toLowerCase()}`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default SalesServiceView;
