import React, { useEffect, useState } from 'react';
import * as usersService from '../services/usersService';
import * as projectService from '../services/projectService';
import styles from './Forms.module.css';

export default function AssignMemberForm({ initial = {}, onCancel, onSave }) {
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [userId, setUserId] = useState(initial.user_id || '');
    const [projectId, setProjectId] = useState(initial.project_id || '');
    const [role, setRole] = useState(initial.role || 'member');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            usersService.fetchUsers().then((res) => setUsers(res.data || [])).catch(() => { }),
            projectService.fetchProjects().then((res) => setProjects(res.data || [])).catch(() => { })
        ]).then(() => setLoading(false));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ user_id: userId, project_id: projectId, role });
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <h3>{initial._id ? 'Update Assignment' : 'Assign Member to Project'}</h3>

            <div className={styles.formGroup}>
                <label>Select Member</label>
                <select value={userId} onChange={(e) => setUserId(e.target.value)} required disabled={loading}>
                    <option value="">Select a member</option>
                    {users.map((u) => (
                        <option key={u._id} value={u._id}>{u.name} - {u.email}</option>
                    ))}
                </select>
            </div>

            <div className={styles.formGroup}>
                <label>Select Project</label>
                <select value={projectId} onChange={(e) => setProjectId(e.target.value)} required disabled={loading}>
                    <option value="">Select a project</option>
                    {projects.map((p) => (
                        <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                </select>
            </div>

            <div className={styles.formGroup}>
                <label>Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="member">Member</option>
                    <option value="lead">Lead</option>
                    <option value="contributor">Contributor</option>
                </select>
            </div>

            <div className={styles.formActions}>
                <button type="button" onClick={onCancel} className={styles.cancelBtn}>
                    Cancel
                </button>
                <button type="submit" className={styles.submitBtn}>
                    Assign Member
                </button>
            </div>
        </form>
    );
}
