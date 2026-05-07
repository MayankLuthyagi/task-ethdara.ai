import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import * as projectAssignService from '../../services/projectAssignService';
import AssignMemberForm from '../../components/AssignMemberForm';

export default function TeamManagement() {
    const { user } = useAuth() || {};
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);

    const load = async () => {
        setLoading(true);
        try {
            const res = await projectAssignService.getAllAssigned();
            setAssignments(res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handleAssign = () => { setEditing(null); setShowForm(true); };

    const handleEdit = (a) => { setEditing(a); setShowForm(true); };

    const handleDelete = async (id) => {
        if (!confirm('Delete assignment?')) return;
        try {
            await projectAssignService.deleteAssign(id);
            setAssignments((s) => s.filter((x) => x._id !== id));
        } catch (err) {
            alert(err.message || 'Delete failed');
        }
    };

    const handleSave = async (payload) => {
        try {
            if (editing && editing._id) {
                const res = await projectAssignService.updateAssign(editing._id, payload);
                setAssignments((s) => s.map((it) => (it._id === editing._id ? res.data : it)));
            } else {
                const res = await projectAssignService.assignProject(payload);
                setAssignments((s) => [res.data, ...s]);
            }
            setShowForm(false);
        } catch (err) {
            alert(err.message || 'Save failed');
        }
    };

    if (!user) return null;
    if (user.role !== 'admin') return <div>Access denied - admin only</div>;

    return (
        <div>
            <h2>Team Management</h2>
            <button onClick={handleAssign}>Assign Member to Project</button>
            {loading && <div>Loading...</div>}
            <div>
                {assignments.map((a) => (
                    <div key={a._id} style={{ border: '1px solid #ddd', padding: 8, margin: 8 }}>
                        <div><strong>{a.project_id?.name}</strong></div>
                        <div>Member: {a.user_id?.name} - {a.user_id?.email}</div>
                        <div>Role: {a.role}</div>
                        <div>Status: {a.status}</div>
                        <div style={{ marginTop: 8 }}>
                            <button onClick={() => handleEdit(a)}>Edit</button>
                            <button onClick={() => handleDelete(a._id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            {showForm && (
                <AssignMemberForm
                    initial={editing || {}}
                    onCancel={() => setShowForm(false)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
}
