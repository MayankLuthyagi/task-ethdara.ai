import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import * as taskAssignService from '../../services/taskAssignService';

export default function MyTasks() {
    const { user } = useAuth() || {};
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        setLoading(true);
        try {
            const res = await taskAssignService.getMyTasks();
            setTasks(res.data || []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { load(); }, []);

    const handleStatusToggle = async (assign) => {
        const newStatus = assign.status === 'pending' ? 'completed' : 'pending';
        try {
            const res = await taskAssignService.updateMyTaskStatus(assign._id, newStatus);
            setTasks((s) => s.map((it) => (it._id === assign._id ? res.data : it)));
        } catch (err) { alert(err.message || 'Update failed'); }
    };

    if (!user) return null;

    return (
        <div>
            <h2>My Tasks</h2>
            {loading && <div>Loading...</div>}
            <div>
                {tasks.map((a) => (
                    <div key={a._id} style={{ border: '1px solid #ddd', padding: 8, margin: 8 }}>
                        <div><strong>{a.task_id?.name}</strong></div>
                        <div>{a.task_id?.detail}</div>
                        <div>Due: {a.task_id?.dueDate ? new Date(a.task_id.dueDate).toLocaleDateString() : '—'}</div>
                        <div>Status: {a.status}</div>
                        <div style={{ marginTop: 8 }}>
                            <button onClick={() => handleStatusToggle(a)}>{a.status === 'pending' ? 'Mark Completed' : 'Mark Pending'}</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
