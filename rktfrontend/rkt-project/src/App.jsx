import React from "react";
import SalesServiceView from "./SalesServiceView";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./Login";
import Integration from "./Integration";
import InventoryInquiry from "./InventoryInquiry";
import JDEDashboard from "./JDEDashboard";
import SignUp from "./Signup";
import SuperAdminDashboard from "./SuperAdminDashboard"; // You'll create this next
import OrgAdminDashboard from "./OrgAdminDashboard";

const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")); 

  if (!token) return <Navigate to="/" />;
  
  // If role is required and doesn't match
  if (allowedRole && user?.role !== allowedRole) {
    // Redirect to their appropriate home base
    if (user?.role === 'ROLE_SUPERADMIN') return <Navigate to="/superadmin/dashboard" />;
    if (user?.role === 'ROLE_ORG_ADMIN') return <Navigate to="/client/dashboard" />;
    return <Navigate to="/dashboard" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login isAdmin={false} />} />
        <Route path="/super-login" element={<Login isAdmin={true} />} />

        <Route path="/register" element={<SignUp />} />

        {/* Superadmin Dashboard - Strictly Protected */}
        <Route
          path="/superadmin/dashboard"
          element={
            <ProtectedRoute allowedRole="ROLE_SUPERADMIN">
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* New Org Admin Route - Also Protected */}
        <Route
          path="/client/dashboard"
          element={
            <ProtectedRoute allowedRole="ROLE_ORG_ADMIN">
              <OrgAdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Regular User / Org Admin Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Integration />
            </ProtectedRoute>
          }
        />

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

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
