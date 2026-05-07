import React, { useState, useEffect } from 'react';

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
        <div className="modal">
            <form onSubmit={handleSubmit} className="modal-content">
                <h3>{initial._id ? 'Edit Project' : 'Create Project'}</h3>
                <div>
                    <label>Name</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                    <label>Detail</label>
                    <textarea value={detail} onChange={(e) => setDetail(e.target.value)} required />
                </div>
                <div style={{ marginTop: 8 }}>
                    <button type="button" onClick={onCancel} disabled={saving}>Cancel</button>
                    <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
                </div>
            </form>
        </div>
    );
}
