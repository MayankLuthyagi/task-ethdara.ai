import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import * as projectAssignService from '../../services/projectAssignService';

export default function MyProjects() {
    const { user } = useAuth() || {};
    const [myProjects, setMyProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        try {
            const res = await projectAssignService.getMyProjects();
            setMyProjects(res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handleStatusToggle = async (assign) => {
        const newStatus = assign.status === 'pending' ? 'completed' : 'pending';
        try {
            const res = await projectAssignService.updateMyProjectStatus(assign._id, newStatus);
            setMyProjects((s) => s.map((it) => (it._id === assign._id ? res.data : it)));
        } catch (err) {
            alert(err.message || 'Update failed');
        }
    };

    if (!user) return null;

    return (
        <div>
            <h2>My Projects</h2>
            {loading && <div>Loading...</div>}
            <div>
                {myProjects.map((m) => (
                    <div key={m._id} style={{ border: '1px solid #ddd', padding: 8, margin: 8 }}>
                        <div><strong>{m.project_id?.name}</strong></div>
                        <div>Role: {m.role}</div>
                        <div>Status: {m.status}</div>
                        <div style={{ marginTop: 8 }}>
                            <button onClick={() => handleStatusToggle(m)}>{m.status === 'pending' ? 'Mark Completed' : 'Mark Pending'}</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
