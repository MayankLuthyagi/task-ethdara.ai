import React, { useState, useEffect } from 'react';
import styles from './Forms.module.css';

export default function ProjectForm({ initial = {}, onCancel, onSave }) {
    const [name, setName] = useState(initial.name || '');
    const [detail, setDetail] = useState(initial.detail || '');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setName(initial.name || '');
        setDetail(initial.detail || '');
    }, [initial]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await onSave({ name: name.trim(), detail: detail.trim() });
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <h3>{initial._id ? 'Edit Project' : 'Add Project'}</h3>
            <div className={styles.formGroup}>
                <label>Project Name</label>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter project name"
                    required
                    disabled={saving}
                />
            </div>
            <div className={styles.formGroup}>
                <label>Description</label>
                <textarea
                    value={detail}
                    onChange={(e) => setDetail(e.target.value)}
                    placeholder="Enter project description"
                    required
                    disabled={saving}
                    rows="4"
                />
            </div>
            <div className={styles.formActions}>
                <button type="button" onClick={onCancel} disabled={saving} className={styles.cancelBtn}>
                    Cancel
                </button>
                <button type="submit" disabled={saving} className={styles.submitBtn}>
                    {saving ? 'Saving...' : 'Create Project'}
                </button>
            </div>
        </form>
    );
}
