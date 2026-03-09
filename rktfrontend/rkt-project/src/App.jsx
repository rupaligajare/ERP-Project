import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Integration from './Integration';
import InventoryInquiry from './InventoryInquiry';
import JDEDashboard from './JDEDashboard'; // Import the new separate component
import SignUp from './Signup';

const PrivateRoute = ({ children }) => {
    const isAuthenticated = !!localStorage.getItem('token');
    return isAuthenticated ? children : <Navigate to="/" />;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<SignUp/>} />
                
                {/* 1. The Integrations Hub (The page you already have) */}
                <Route 
                    path="/dashboard" 
                    element={
                        <PrivateRoute>
                            <Integration/>
                        </PrivateRoute>
                    } 
                />

                {/* 2. The New Separate Role-Based Dashboard */}
                <Route 
                    path="/jde-services" 
                    element={
                        <PrivateRoute>
                            <JDEDashboard />
                        </PrivateRoute>
                    } 
                />

                {/* 3. The Specific Module Workspace */}
                <Route 
                    path="/inventory" 
                    element={
                        <PrivateRoute>
                            <InventoryInquiry/>
                        </PrivateRoute>
                    } 
                />
              
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;