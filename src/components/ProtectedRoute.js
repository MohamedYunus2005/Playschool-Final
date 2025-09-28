// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ isLoggedIn }) => {
    if (!isLoggedIn) {
        // If not logged in, redirect to the login page
        return <Navigate to="/login" replace />;
    }
    // If logged in, render the child routes
    return <Outlet />;
};

export default ProtectedRoute;