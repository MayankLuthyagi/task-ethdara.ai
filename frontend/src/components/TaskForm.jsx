import React, { useEffect, useState } from 'react';
import * as projectService from '../services/projectService';
import styles from './Forms.module.css';

export default function TaskForm({ initial = {}, onCancel, onSave }) {
    const [name, setName] = useState(initial.name || '');
    const [detail, setDetail] = useState(initial.detail || '');
    const [projectId, setProjectId] = useState(initial.projectId || '');
    const [dueDate, setDueDate] = useState(initial.dueDate ? initial.dueDate.split('T')[0] : '');
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        projectService.fetchProjects().then((res) => {
            setProjects(res.data || []);
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ name: name.trim(), detail: detail.trim(), projectId, dueDate: dueDate || undefined });
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <h3>{initial._id ? 'Edit Task' : 'Add Task'}</h3>
            <div className={styles.formGroup}>
                <label>Task Name</label>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter task name"
                    required
                />
            </div>
            <div className={styles.formGroup}>
                <label>Description</label>
                <textarea
                    value={detail}
                    onChange={(e) => setDetail(e.target.value)}
                    placeholder="Enter task description"
                    required
                    rows="4"
                />
            </div>
            <div className={styles.formGroup}>
                <label>Project</label>
                <select value={projectId} onChange={(e) => setProjectId(e.target.value)} required disabled={loading}>
                    <option value="">Select project</option>
                    {projects.map((p) => (<option key={p._id} value={p._id}>{p.name}</option>))}
                </select>
            </div>
            <div className={styles.formGroup}>
                <label>Due Date</label>
                <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                />
            </div>
            <div className={styles.formActions}>
                <button type="button" onClick={onCancel} className={styles.cancelBtn}>
                    Cancel
                </button>
                <button type="submit" className={styles.submitBtn}>
                    Create Task
                </button>
            </div>
        </form>
    );
}
