import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import * as projectService from '../../services/projectService';
import ProjectForm from '../../components/ProjectForm';

export default function Projects() {
    const { user } = useAuth() || {};
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);

    const load = async () => {
        setLoading(true);
        try {
            const res = await projectService.fetchProjects();
            setProjects(res.data || []);
        } catch (err) {
            setError(err.message || 'Failed to load projects');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handleCreate = () => { setEditing(null); setShowForm(true); };

    const handleEdit = (p) => { setEditing(p); setShowForm(true); };

    const handleDelete = async (id) => {
        if (!confirm('Delete this project?')) return;
        try {
            await projectService.deleteProject(id);
            setProjects((s) => s.filter((x) => x._id !== id));
        } catch (err) {
            alert(err.message || 'Delete failed');
        }
    };

    const handleSave = async (payload) => {
        try {
            if (editing && editing._id) {
                const res = await projectService.updateProject(editing._id, payload);
                setProjects((s) => s.map((p) => (p._id === editing._id ? res.data : p)));
            } else {
                const res = await projectService.createProject(payload);
                setProjects((s) => [res.data, ...s]);
            }
            setShowForm(false);
        } catch (err) {
            alert(err.message || 'Save failed');
        }
    };

    return (
        <div>
            <h2>Projects</h2>
            {user && user.role === 'admin' && <button onClick={handleCreate}>New Project</button>}
            {loading && <div>Loading...</div>}
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <div>
                {projects.map((p) => (
                    <div key={p._id} style={{ border: '1px solid #ddd', padding: 8, margin: 8 }}>
                        <h3>{p.name}</h3>
                        <p>{p.detail}</p>
                        <div>
                            <small>Created by: {p.createdBy?.name || '—'}</small>
                        </div>
                        {user && user.role === 'admin' && (
                            <div style={{ marginTop: 8 }}>
                                <button onClick={() => handleEdit(p)}>Edit</button>
                                <button onClick={() => handleDelete(p._id)}>Delete</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {showForm && (
                <ProjectForm
                    initial={editing || {}}
                    onCancel={() => setShowForm(false)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
}
