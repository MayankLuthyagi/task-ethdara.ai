import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import * as projectAssignService from '../../services/projectAssignService';
import AssignMemberForm from '../../components/AssignMemberForm';
import styles from './Dashboard.module.css';

export default function TeamManagement() {
    const { user } = useAuth() || {};
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);

    const load = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await projectAssignService.getTeamMembers();
            console.log('Team Members API Response:', res);
            setTeamMembers(res.data || []);
        } catch (err) {
            console.error('Error loading team members:', err);
            console.error('Error status:', err.status);
            console.error('Error data:', err.data);
            setError(err.message || 'Failed to load team members');
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
            // Reload team members to reflect the deletion
            load();
        } catch (err) {
            alert(err.message || 'Delete failed');
        }
    };

    const handleSave = async (payload) => {
        try {
            if (editing && editing._id) {
                const res = await projectAssignService.updateAssign(editing._id, payload);
                load(); // Reload team members after update
            } else {
                const res = await projectAssignService.assignProject(payload);
                load(); // Reload team members after assignment
            }
            setShowForm(false);
        } catch (err) {
            alert(err.message || 'Save failed');
        }
    };

    // Flatten team members and their assignments for table display
    const getTableRows = () => {
        const rows = [];
        teamMembers.forEach((member) => {
            if (member.assignments.length === 0) {
                rows.push({
                    memberId: member._id,
                    memberName: member.name,
                    memberEmail: member.email,
                    assignmentId: null,
                    projectName: '-',
                    role: '-',
                    status: '-'
                });
            } else {
                member.assignments.forEach((assignment) => {
                    rows.push({
                        memberId: member._id,
                        memberName: member.name,
                        memberEmail: member.email,
                        assignmentId: assignment._id,
                        projectName: assignment.project_id?.name || '-',
                        role: assignment.role || '-',
                        status: assignment.status || '-',
                        assignmentObj: assignment
                    });
                });
            }
        });
        return rows;
    };

    if (!user) return null;
    if (user.role !== 'admin') return <div style={{ padding: '20px' }}>Access denied - admin only</div>;

    const tableRows = getTableRows();

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0 }}>Team Management</h2>
                <button className={styles.addBtn} onClick={handleAssign}>+ Assign Member to Project</button>
            </div>

            {error && (
                <div style={{ padding: '12px', marginBottom: '16px', backgroundColor: '#fee', color: '#c00', borderRadius: '4px', border: '1px solid #f00' }}>
                    ⚠️ Error: {error}
                </div>
            )}

            {loading && <div style={{ padding: '20px', textAlign: 'center' }}>Loading team members...</div>}

            {!loading && (
                <div className={styles.tableContainer}>
                    <table className={styles.projectTable}>
                        <thead>
                            <tr>
                                <th>Member Name</th>
                                <th>Email</th>
                                <th>Project</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableRows.length > 0 ? (
                                tableRows.map((row, idx) => (
                                    <tr key={`${row.memberId}-${idx}`}>
                                        <td className={styles.projectName}>{row.memberName}</td>
                                        <td>{row.memberEmail}</td>
                                        <td>{row.projectName}</td>
                                        <td>{row.role}</td>
                                        <td>
                                            {row.status !== '-' && (
                                                <span className={`${styles.status} ${styles[row.status?.toLowerCase()]}`}>
                                                    {row.status}
                                                </span>
                                            )}
                                            {row.status === '-' && <span>-</span>}
                                        </td>
                                        <td>
                                            {row.assignmentId && (
                                                <div style={{ display: 'flex', gap: '6px' }}>
                                                    <button
                                                        onClick={() => handleEdit(row.assignmentObj)}
                                                        style={{ padding: '6px 10px', fontSize: '12px', cursor: 'pointer', background: '#0066cc', color: 'white', border: 'none', borderRadius: '4px' }}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(row.assignmentId)}
                                                        style={{ padding: '6px 10px', fontSize: '12px', cursor: 'pointer', background: '#cc0000', color: 'white', border: 'none', borderRadius: '4px' }}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                                        No team members added yet
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {showForm && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <AssignMemberForm
                            initial={editing || {}}
                            onCancel={() => setShowForm(false)}
                            onSave={handleSave}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
