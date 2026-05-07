import React, { useEffect, useState } from 'react';
import * as usersService from '../services/usersService';
import * as taskService from '../services/taskService';
import Modal from './Modal';
import styles from './Forms.module.css';

export default function TaskAssignModal({ task = {}, onCancel, onAssign }) {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(task.assignedTo?._id || '');
    const [deadline, setDeadline] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedUser) {
            alert('Please select a user');
            return;
        }
        onAssign({ user_id: selectedUser, task_id: task._id, deadline: deadline || undefined });
    };

    return (
        <Modal onClose={onCancel}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <h3>Assign Task: {task.name}</h3>

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

                <div className={styles.formGroup}>
                    <label>Deadline (Optional)</label>
                    <input
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        disabled={loading}
                    />
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
                        {loading ? 'Loading...' : 'Assign Task'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
