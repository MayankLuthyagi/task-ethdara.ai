import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import styles from './Header.module.css';

export default function Header() {
    const { user, logout } = useAuth() || {};
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/auth/login');
    };

    return (
        <header className={styles.header}>
            <nav className={styles.navLinks}>
                <Link to="/" className={styles.link}>Dashboard</Link>
                <Link to="/projects" className={styles.link}>Projects</Link>
                <Link to="/tasks" className={styles.link}>Tasks</Link>
                {user?.role === 'admin' && <Link to="/team" className={styles.link}>Team</Link>}
                <Link to="/my-projects" className={styles.link}>My Projects</Link>
                <Link to="/my-tasks" className={styles.link}>My Tasks</Link>
            </nav>

            <div className={styles.userSection}>
                {user ? (
                    <>
                        <span className={styles.userInfo}>{user.name} ({user.role})</span>
                        <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
                    </>
                ) : (
                    <Link to="/auth/login" className={styles.link}>Sign in</Link>
                )}
            </div>
        </header>
    );
}
