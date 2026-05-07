import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import * as projectService from '../../services/projectService';
import * as projectAssignService from '../../services/projectAssignService';
import ProjectForm from '../../components/ProjectForm';
import Modal from '../../components/Modal';
import styles from './Dashboard.module.css';

export default function Projects() {
    const { user } = useAuth() || {};
    const [projects, setProjects] = useState([]);
    const [projectMembers, setProjectMembers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);

    const load = async () => {
        setLoading(true);
        try {
            const res = await projectService.fetchProjects();
            setProjects(res.data || []);

            // Fetch assigned members for each project
            try {
                const assignmentsRes = await projectAssignService.getAllAssigned();
                const membersMap = {};
                (assignmentsRes.data || []).forEach((assignment) => {
                    if (!membersMap[assignment.project_id._id]) {
                        membersMap[assignment.project_id._id] = [];
                    }
                    membersMap[assignment.project_id._id].push(assignment.user_id);
                });
                setProjectMembers(membersMap);
            } catch (err) {
                console.error('Failed to load project members:', err);
            }
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0 }}>All Projects</h2>
                {user && user.role === 'admin' && (
                    <button className={styles.addBtn} onClick={handleCreate}>+ New Project</button>
                )}
            </div>

            {loading && <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>}
            {error && <div style={{ color: '#c00', padding: '12px', marginBottom: '16px', backgroundColor: '#fee', borderRadius: '4px', border: '1px solid #f00' }}>{error}</div>}

            {!loading && (
                <div className={styles.tableContainer}>
                    <table className={styles.projectTable}>
                        <thead>
                            <tr>
                                <th>Project Name</th>
                                <th>Description</th>
                                <th>Created By</th>
                                <th>Assigned To</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.length > 0 ? (
                                projects.map((p) => (
                                    <tr key={p._id}>
                                        <td className={styles.projectName}>{p.name}</td>
                                        <td>{p.detail}</td>
                                        <td>{p.createdBy?.name || '-'}</td>
                                        <td>
                                            {projectMembers[p._id] && projectMembers[p._id].length > 0 ? (
                                                <div>
                                                    {projectMembers[p._id].map((member, idx) => (
                                                        <div key={idx} style={{ fontSize: '13px', marginBottom: idx < projectMembers[p._id].length - 1 ? '6px' : '0', color: '#0066cc', fontWeight: '500' }}>
                                                            👤 {member.name}
                                                            <div style={{ fontSize: '11px', color: '#666', fontWeight: '400' }}>{member.email}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span style={{ color: '#999' }}>-</span>
                                            )}
                                        </td>
                                        <td>
                                            {user && user.role === 'admin' && (
                                                <div style={{ display: 'flex', gap: '6px' }}>
                                                    <button
                                                        onClick={() => handleEdit(p)}
                                                        style={{ padding: '6px 10px', fontSize: '16px', cursor: 'pointer', background: '#0066cc', color: 'white', border: 'none', borderRadius: '4px' }}
                                                        title="Edit project"
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(p._id)}
                                                        style={{ padding: '6px 10px', fontSize: '16px', cursor: 'pointer', background: '#cc0000', color: 'white', border: 'none', borderRadius: '4px' }}
                                                        title="Delete project"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>No projects found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {showForm && (
                <Modal onClose={() => setShowForm(false)}>
                    <ProjectForm
                        initial={editing || {}}
                        onCancel={() => setShowForm(false)}
                        onSave={handleSave}
                    />
                </Modal>
            )}
        </div>
    );
}
