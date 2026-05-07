import React, { useEffect, useState } from 'react';
import * as usersService from '../services/usersService';
import * as projectService from '../services/projectService';

export default function AssignMemberForm({ initial = {}, onCancel, onSave }) {
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [userId, setUserId] = useState(initial.user_id || '');
    const [projectId, setProjectId] = useState(initial.project_id || '');
    const [role, setRole] = useState(initial.role || 'member');

    useEffect(() => {
        usersService.fetchUsers().then((res) => setUsers(res.data || [])).catch(() => { });
        projectService.fetchProjects().then((res) => setProjects(res.data || [])).catch(() => { });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ user_id: userId, project_id: projectId, role });
    };

    return (
        <div className="modal">
            <form onSubmit={handleSubmit} className="modal-content">
                <h3>{initial._id ? 'Update Assignment' : 'Assign Project'}</h3>

                <div>
                    <label>User</label>
                    <select value={userId} onChange={(e) => setUserId(e.target.value)} required>
                        <option value="">Select user</option>
                        {users.map((u) => (
                            <option key={u._id} value={u._id}>{u.name} — {u.email}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Project</label>
                    <select value={projectId} onChange={(e) => setProjectId(e.target.value)} required>
                        <option value="">Select project</option>
                        {projects.map((p) => (
                            <option key={p._id} value={p._id}>{p.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Role</label>
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="member">Member</option>
                        <option value="lead">Lead</option>
                        <option value="contributor">Contributor</option>
                    </select>
                </div>

                <div style={{ marginTop: 8 }}>
                    <button type="button" onClick={onCancel}>Cancel</button>
                    <button type="submit">Save</button>
                </div>
            </form>
        </div>
    );
}
