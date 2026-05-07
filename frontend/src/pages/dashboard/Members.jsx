import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import * as usersService from '../../services/usersService';
import MemberFormEdit from '../../components/MemberFormEdit';
import Modal from '../../components/Modal';
import styles from './Dashboard.module.css';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
export default function Members() {
    const { user } = useAuth() || {};
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);

    const load = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await usersService.fetchUsers();
            setMembers(res.data || []);
        } catch (err) {
            console.error('Error loading members:', err);
            setError(err.message || 'Failed to load members');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handleCreate = () => {
        setEditing(null);
        setShowForm(true);
    };

    const handleEdit = (m) => {
        setEditing(m);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this member?')) return;
        try {
            await usersService.deleteUser(id);
            setMembers((s) => s.filter((x) => x._id !== id));
        } catch (err) {
            alert(err.message || 'Delete failed');
        }
    };

    const handleSave = async (payload) => {
        try {
            if (editing && editing._id) {
                const res = await usersService.updateUser(editing._id, payload);
                setMembers((s) => s.map((m) => (m._id === editing._id ? res.data : m)));
            } else {
                // For creating new members, we'll use the auth endpoint
                alert('Creating new members is handled through the registration process');
                setShowForm(false);
                return;
            }
            setShowForm(false);
        } catch (err) {
            alert(err.message || 'Save failed');
        }
    };

    if (!user) return null;
    if (user.role !== 'admin') return <div style={{ padding: '20px' }}>Access denied - admin only</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0 }}>Members</h2>
                <button className={styles.addBtn} onClick={handleCreate}>+ New Member</button>
            </div>

            {error && (
                <div style={{ padding: '12px', marginBottom: '16px', backgroundColor: '#fee', color: '#c00', borderRadius: '4px', border: '1px solid #f00' }}>
                    ⚠️ Error: {error}
                </div>
            )}

            {loading && <div style={{ padding: '20px', textAlign: 'center' }}>Loading members...</div>}

            {!loading && (
                <div className={styles.tableContainer}>
                    <table className={styles.projectTable}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.length > 0 ? (
                                members.map((m) => (
                                    <tr key={m._id}>
                                        <td className={styles.projectName}>{m.name}</td>
                                        <td>{m.email}</td>
                                        <td><span style={{ textTransform: 'capitalize' }}>{m.role}</span></td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '6px' }}>
                                                <button
                                                    onClick={() => handleEdit(m)}
                                                    style={{
                                                        padding: '6px 10px',
                                                        fontSize: '16px',
                                                        cursor: 'pointer',
                                                        background: '#0066cc',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '4px'
                                                    }}
                                                    title="Edit member"
                                                >
                                                   <FiEdit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(m._id)}
                                                    style={{
                                                        padding: '6px 10px',
                                                        fontSize: '16px',
                                                        cursor: 'pointer',
                                                        background: '#cc0000',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '4px'
                                                    }}
                                                    title="Delete member"
                                                >
                                                    <FiTrash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                                        No members found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {showForm && (
                <Modal onClose={() => setShowForm(false)}>
                    <MemberFormEdit
                        initial={editing || {}}
                        onCancel={() => setShowForm(false)}
                        onSave={handleSave}
                    />
                </Modal>
            )}
        </div>
    );
}
