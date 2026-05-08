import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import styles from './login.module.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                {/* Left section - branding */}
                <div className={styles.branding}>
                    <img src="/logo.webp" alt="Ethara Logo" className={styles.brandIcon} />
                    <h1 className={styles.brandTitle}>Ethara</h1>
                    <p className={styles.brandSubtitle}>Project Management Platform</p>
                    <div className={styles.features}>
                        <div className={styles.feature}>• Manage Projects</div>
                        <div className={styles.feature}>• Assign Tasks</div>
                        <div className={styles.feature}>• Track Progress</div>
                        <div className={styles.feature}>• Team Collaboration</div>
                    </div>
                </div>

                {/* Right section - login form */}
                <div className={styles.formSection}>
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitle}>Welcome Back</h2>
                            <p className={styles.cardSubtitle}>Sign in to your account</p>
                        </div>

                        <form onSubmit={handleSubmit} className={styles.form}>
                            {/* Email Input */}
                            <div className={styles.formGroup}>
                                <label htmlFor="email" className={styles.label}>
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={styles.input}
                                    placeholder="you@example.com"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            {/* Password Input */}
                            <div className={styles.formGroup}>
                                <label htmlFor="password" className={styles.label}>
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={styles.input}
                                    placeholder="Enter your password"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className={styles.errorMessage}>
                                    <span>!</span>
                                    {error}
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className={styles.submitBtn}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className={styles.spinner}></span>
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </form>

                        {/* Demo Credentials */}
                        <div className={styles.divider}>
                            <span>Demo Credentials</span>
                        </div>
                        <div className={styles.demoInfo}>
                            <p><strong>User:</strong> member@ethara.ai</p>
                            <p><strong>Password:</strong> password123</p>
                            <p><strong>Admin:</strong> admin@ethara.ai</p>
                            <p><strong>Password:</strong> admin123</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
