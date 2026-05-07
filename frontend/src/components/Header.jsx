import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function Header() {
    const { user, logout } = useAuth() || {};
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/auth/login');
    };

    return (
        <header style={{ borderBottom: '1px solid var(--border)', padding: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <Link to="/">Dashboard</Link>
                <Link to="/projects">Projects</Link>
                <Link to="/tasks">Tasks</Link>
                {user?.role === 'admin' && <Link to="/team">Team</Link>}
                <Link to="/my-projects">My Projects</Link>
                <Link to="/my-tasks">My Tasks</Link>
            </div>

            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                {user ? (
                    <>
                        <span>{user.name} ({user.role})</span>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <Link to="/auth/login">Sign in</Link>
                )}
            </div>
        </header>
    );
}
