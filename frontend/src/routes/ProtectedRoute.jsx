import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function ProtectedRoute({ redirectTo = '/auth/login' }) {
    const { user, loading } = useAuth() || {};
    if (loading) return null;
    if (!user) return <Navigate to={redirectTo} replace />;
    return <Outlet />;
}
