import React, { useEffect, useState } from 'react';
import * as usersService from '../services/usersService';
import Modal from './Modal';
import styles from './Forms.module.css';

export default function ProjectAssignModal({ project = {}, onCancel, onAssign }) {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('ProjectAssignModal received project:', project);
        const loadUsers = async () => {
            try {
                const res = await usersService.fetchUsers();
                setUsers(res.data || []);
            } catch (err) {
                console.error('Failed to load users:', err);
            } finally {
                setLoading(false);
            }
        };
        loadUsers();
    }, [project]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedUser) {
            alert('Please select a user');
            return;
        }
        if (!project._id) {
            alert('Error: Project ID is missing');
            console.error('Project object:', project);
            return;
        }
        const payload = { user_id: selectedUser, project_id: project._id };
        console.log('Sending assign payload:', payload);
        onAssign(payload);
    };

    return (
        <Modal onClose={onCancel}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <h3>Assign Project: {project.name}</h3>

                <div className={styles.formGroup}>
                    <label>Select Team Member</label>
                    <select
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                        disabled={loading}
                        required
                    >
                        <option value="">-- Select a user --</option>
                        {users.filter(u => u.role === 'member').map((u) => (
                            <option key={u._id} value={u._id}>
                                {u.name} - {u.email}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.formActions}>
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className={styles.cancelBtn}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className={styles.submitBtn}
                    >
                        {loading ? 'Loading...' : 'Assign Project'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
