import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Components
import Login from "./Login";
import SignUp from "./Signup";
import Integration from "./Integration";
import SuperAdminDashboard from "./SuperAdminDashboard";
import OrgAdminDashboard from "./OrgAdminDashboard";
import JDEDashboard from "./JDEDashboard";
import SalesServiceView from "./SalesServiceView";
import InventoryInquiry from "./InventoryInquiry";

// Updated ProtectedRoute
const ProtectedRoute = ({ children, allowedRoles }) => { // Changed to allowedRoles (plural)
  const publicToken = localStorage.getItem("token");
  const jdeToken = localStorage.getItem("jde_token");
  const userRole = localStorage.getItem("user_role");

  if (!publicToken) return <Navigate to="/" />;

  const jdePages = ["/sales", "/inventory", "/jde-services"];
  if (jdePages.includes(window.location.pathname) && !jdeToken) {
    return <Navigate to="/integration" />; 
  }

  // 3. Updated Role Protection logic
  if (allowedRoles) {
    const isAuthorized = allowedRoles.includes(userRole);
    if (!isAuthorized) {
      if (userRole === 'ROLE_SUPERADMIN') return <Navigate to="/superadmin/dashboard" />;
      if (userRole === 'ROLE_ORG_ADMIN' || userRole === 'ROLE_ADMIN') return <Navigate to="/admin/dashboard" />;
      return <Navigate to="/integration" />;
    }
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<SignUp />} />

        {/* The Selection Portal */}
        <Route
          path="/integration"
          element={
            <ProtectedRoute>
              <Integration />
            </ProtectedRoute>
          }
        />

        {/* Superadmin Routes */}
        <Route
          path="/superadmin/dashboard"
          element={
            <ProtectedRoute allowedRole="ROLE_SUPERADMIN">
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Client Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRole="ROLE_ORG_ADMIN">
              <OrgAdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* JDE Specific Routes */}
        <Route
          path="/jde-services"
          element={
            <ProtectedRoute>
              <JDEDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sales"
          element={
            <ProtectedRoute>
              <SalesServiceView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory"
          element={
            <ProtectedRoute>
              <InventoryInquiry />
            </ProtectedRoute>
          }
        />

        {/* Default Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;