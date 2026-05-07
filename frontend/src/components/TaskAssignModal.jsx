import React, { useEffect, useState } from 'react';
import * as usersService from '../services/usersService';
import * as taskService from '../services/taskService';

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
        <div>
            <h3 style={{ marginTop: 0, color: '#333', marginBottom: '20px' }}>Assign Task: {task.name}</h3>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Select Team Member</label>
                    <select
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                        disabled={loading}
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
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
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#333' }}>Deadline (Optional)</label>
                    <input
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        disabled={loading}
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button
                        type="button"
                        onClick={onCancel}
                        style={{ padding: '8px 16px', cursor: 'pointer', background: '#ccc', color: '#333', border: 'none', borderRadius: '4px', fontSize: '14px', fontWeight: '500' }}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{ padding: '8px 16px', cursor: loading ? 'not-allowed' : 'pointer', background: '#009900', color: 'white', border: 'none', borderRadius: '4px', fontSize: '14px', fontWeight: '500' }}
                    >
                        {loading ? 'Loading...' : 'Assign'}
                    </button>
                </div>
            </form>
        </div>
    );
}
