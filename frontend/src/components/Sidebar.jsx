import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import styles from './Sidebar.module.css';

export default function Sidebar() {
    const { user, logout } = useAuth() || {};
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(true);

    const handleLogout = () => {
        logout();
        navigate('/auth/login');
    };

    const isActive = (path) => location.pathname === path;

    const menuItems = user?.role === 'admin'
        ? [
            { path: '/', label: 'Dashboard', icon: '' },
            { path: '/projects', label: 'All Projects', icon: '' },
            { path: '/tasks', label: 'All Tasks', icon: '' },
            { path: '/team', label: 'Team Management', icon: '' },
        ]
        : [
            { path: '/', label: 'Dashboard', icon: '' },
            { path: '/projects', label: 'All Projects', icon: '' },
            { path: '/tasks', label: 'All Tasks', icon: '' },
            { path: '/my-projects', label: 'My Projects', icon: '' },
            { path: '/my-tasks', label: 'My Tasks', icon: '' },
        ];

    return (
        <>
            <div className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.logo}>
                        <img src="/logo.webp" alt="Ethara Logo" className={styles.logoIcon} />
                        {isOpen && <span className={styles.logoText}>Ethara</span>}
                    </div>
                    <button
                        className={styles.toggleBtn}
                        onClick={() => setIsOpen(!isOpen)}
                        title={isOpen ? 'Collapse' : 'Expand'}
                    >
                        {isOpen ? '<' : '>'}
                    </button>
                </div>

                {/* Navigation */}
                <nav className={styles.nav}>
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`${styles.navItem} ${isActive(item.path) ? styles.active : ''}`}
                            title={!isOpen ? item.label : ''}
                        >
                            <span className={styles.icon}>{item.icon}</span>
                            {isOpen && <span className={styles.label}>{item.label}</span>}
                        </Link>
                    ))}
                </nav>

                {/* Footer */}
                <div className={styles.footer}>
                    <div className={styles.userInfo}>
                        <img src="/logo.webp" alt="User Profile" className={styles.avatar} />
                        {isOpen && (
                            <div className={styles.userDetails}>
                                <div className={styles.userName}>{user?.name}</div>
                                <div className={styles.userRole}>{user?.role}</div>
                            </div>
                        )}
                    </div>
                    <button
                        className={styles.logoutBtn}
                        onClick={handleLogout}
                        title="Logout"
                    >
                        {isOpen ? 'Logout' : '×'}
                    </button>
                </div>
            </div>

            {/* Mobile backdrop */}
            <div
                className={`${styles.backdrop} ${isOpen ? styles.visible : ''}`}
                onClick={() => setIsOpen(false)}
            />
        </>
    );
}
