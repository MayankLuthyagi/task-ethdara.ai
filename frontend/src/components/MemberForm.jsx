import React, { useState } from 'react';
import styles from './Forms.module.css';

const errorStyle = {
    padding: '12px',
    background: 'var(--accent-bg, rgba(255, 59, 48, 0.1))',
    color: 'var(--accent, #ff3b30)',
    borderRadius: '8px',
    fontSize: '14px',
    border: '1px solid var(--border)',
    marginBottom: '12px'
};

export default function MemberForm({ onCancel, onSave }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('member');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSaving(true);
        try {
            await onSave({
                name: name.trim(),
                email: email.trim(),
                password: password.trim(),
                role
            });
        } catch (err) {
            setError(err.message || 'Failed to create member');
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <h3>Add New Member</h3>

            {error && (
                <div style={errorStyle}>
                    {error}
                </div>
            )}

            <div className={styles.formGroup}>
                <label>Full Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter member name"
                    required
                    disabled={saving}
                />
            </div>

            <div className={styles.formGroup}>
                <label>Email Address</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    required
                    disabled={saving}
                />
            </div>

            <div className={styles.formGroup}>
                <label>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                    disabled={saving}
                    minLength="6"
                />
            </div>

            <div className={styles.formGroup}>
                <label>Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} disabled={saving}>
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                </select>
            </div>

            <div className={styles.formActions}>
                <button type="button" onClick={onCancel} disabled={saving} className={styles.cancelBtn}>
                    Cancel
                </button>
                <button type="submit" disabled={saving} className={styles.submitBtn}>
                    {saving ? 'Creating...' : 'Create Member'}
                </button>
            </div>
        </form>
    );
}
