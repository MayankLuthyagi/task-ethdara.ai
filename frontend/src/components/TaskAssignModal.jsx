import React, { useEffect, useState } from 'react';
import * as usersService from '../services/usersService';
import * as taskService from '../services/taskService';

export default function TaskAssignModal({ task = {}, onCancel, onAssign }) {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(task.assignedTo || '');

    useEffect(() => {
        usersService.fetchUsers().then((res) => setUsers(res.data || [])).catch(() => { });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        onAssign({ user_id: selectedUser, task_id: task._id });
    };

    return (
        <div className="modal">
            <form className="modal-content" onSubmit={handleSubmit}>
                <h3>Assign Task: {task.name}</h3>
                <div>
                    <label>User</label>
                    <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} required>
                        <option value="">Select user</option>
                        {users.map((u) => (<option key={u._id} value={u._id}>{u.name} - {u.email}</option>))}
                    </select>
                </div>
                <div style={{ marginTop: 8 }}>
                    <button type="button" onClick={onCancel}>Cancel</button>
                    <button type="submit">Assign</button>
                </div>
            </form>
        </div>
    );
}
