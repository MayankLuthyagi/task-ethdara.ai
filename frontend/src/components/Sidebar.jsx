import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { FiMenu, FiX } from 'react-icons/fi';
import styles from './Sidebar.module.css';

export default function Sidebar() {
    const { user, logout } = useAuth() || {};
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/auth/login');
    };

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const closeSidebar = () => {
        setIsOpen(false);
    };

    const isActive = (path) => location.pathname === path;

    const menuItems = user?.role === 'admin'
        ? [
            { path: '/', label: 'Dashboard', icon: '' },
            { path: '/projects', label: 'All Projects', icon: '' },
            { path: '/tasks', label: 'All Tasks', icon: '' },
            { path: '/members', label: 'Members', icon: '' },
            { path: '/team', label: 'Assignment Management', icon: '' },
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
            {/* Hamburger Button - Visible on tablet and mobile */}
            <button className={styles.hamburgerBtn} onClick={handleToggle} title="Toggle menu">
                {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>

            <div className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.logo}>
                        <img src="/logo.webp" alt="Ethara Logo" className={styles.logoIcon} />
                        <span className={styles.logoText}>Ethara</span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className={styles.nav}>
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`${styles.navItem} ${isActive(item.path) ? styles.active : ''}`}
                            onClick={closeSidebar}
                            title={item.label}
                        >
                            <span className={styles.icon}>{item.icon}</span>
                            <span className={styles.label}>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* Footer */}
                <div className={styles.footer}>
                    <div className={styles.userInfo}>
                        <img src="/logo.webp" alt="User Profile" className={styles.avatar} />
                        <div className={styles.userDetails}>
                            <div className={styles.userName}>{user?.name}</div>
                            <div className={styles.userRole}>{user?.role}</div>
                        </div>
                    </div>
                    <button
                        className={styles.logoutBtn}
                        onClick={handleLogout}
                        title="Logout"
                    >
                        Logout
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
