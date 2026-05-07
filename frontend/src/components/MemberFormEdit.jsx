import React, { useState, useEffect } from 'react';
import styles from './Forms.module.css';

export default function MemberFormEdit({ initial = {}, onCancel, onSave }) {
    const [name, setName] = useState(initial.name || '');
    const [email, setEmail] = useState(initial.email || '');
    const [role, setRole] = useState(initial.role || 'member');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setName(initial.name || '');
        setEmail(initial.email || '');
        setRole(initial.role || 'member');
    }, [initial]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim() || !email.trim()) {
            alert('Please fill all fields');
            return;
        }
        setSaving(true);
        try {
            await onSave({ name: name.trim(), email: email.trim(), role });
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <h3>{initial._id ? 'Edit Member' : 'New Member'}</h3>
            <div className={styles.formGroup}>
                <label>Name</label>
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
                <label>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter member email"
                    required
                    disabled={saving || !!initial._id}
                />
            </div>
            <div className={styles.formGroup}>
                <label>Role</label>
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                    disabled={saving}
                >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
            <div className={styles.formActions}>
                <button type="button" onClick={onCancel} disabled={saving} className={styles.cancelBtn}>
                    Cancel
                </button>
                <button type="submit" disabled={saving} className={styles.submitBtn}>
                    {saving ? 'Saving...' : 'Save'}
                </button>
            </div>
        </form>
    );
}
