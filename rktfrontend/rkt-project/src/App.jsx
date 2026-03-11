import React from "react";
import SalesServiceView from './SalesServiceView';
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

// Enhanced PrivateRoute to check for specific roles
const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")); // Store user object on login

  if (!token) return <Navigate to="/" />;
  
  // If a specific role is required (like SUPERADMIN), check it here
  if (allowedRole && user?.role !== allowedRole) {
    return <Navigate to="/dashboard" />; // Redirect regular users to their own dashboard
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