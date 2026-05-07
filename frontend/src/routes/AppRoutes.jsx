import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/login';
import Dashboard from '../pages/dashboard/Dashboard';
import Projects from '../pages/dashboard/Projects';
import Tasks from '../pages/dashboard/Tasks';
import TeamManagement from '../pages/dashboard/TeamManagement';
import MyProjects from '../pages/dashboard/MyProjects';
import ProtectedRoute from './ProtectedRoute';
import NotFound from '../pages/404';

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/auth/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/team" element={<TeamManagement />} />
                <Route path="/my-projects" element={<MyProjects />} />
            </Route>

            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
    );
}
