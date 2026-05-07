import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import * as taskService from '../../services/taskService';
import * as taskAssignService from '../../services/taskAssignService';
import TaskForm from '../../components/TaskForm';
import TaskAssignModal from '../../components/TaskAssignModal';
import Modal from '../../components/Modal';
import styles from './Dashboard.module.css';

export default function Tasks() {
    const { user } = useAuth() || {};
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [showAssign, setShowAssign] = useState(false);
    const [assigningTask, setAssigningTask] = useState(null);

    const load = async () => {
        setLoading(true);
        try {
            const res = await taskService.fetchTasks();
            setTasks(res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handleCreate = () => { setEditing(null); setShowForm(true); };
    const handleEdit = (t) => { setEditing(t); setShowForm(true); };
    const handleDelete = async (id) => {
        if (!confirm('Delete task?')) return;
        try {
            await taskService.deleteTask(id);
            setTasks((s) => s.filter((x) => x._id !== id));
        } catch (err) { alert(err.message || 'Delete failed'); }
    };

    const handleSave = async (payload) => {
        try {
            if (editing && editing._id) {
                const res = await taskService.updateTask(editing._id, payload);
                setTasks((s) => s.map((it) => (it._id === editing._id ? res.data : it)));
            } else {
                const res = await taskService.createTask(payload);
                setTasks((s) => [res.data, ...s]);
            }
            setShowForm(false);
        } catch (err) { alert(err.message || 'Save failed'); }
    };

    const handleAssignClick = (task) => { setAssigningTask(task); setShowAssign(true); };

    const handleAssign = async (payload) => {
        try {
            await taskAssignService.assignTask(payload);
            setShowAssign(false);
            load();
        } catch (err) { alert(err.message || 'Assign failed'); }
    };

    if (!user) return null;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0 }}>All Tasks</h2>
                {user.role === 'admin' && (
                    <button className={styles.addBtn} onClick={handleCreate}>+ New Task</button>
                )}
            </div>

            {loading && <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>}

            {!loading && (
                <div className={styles.tableContainer}>
                    <table className={styles.projectTable}>
                        <thead>
                            <tr>
                                <th>Task Name</th>
                                <th>Project</th>
                                <th>Description</th>
                                <th>Due Date</th>
                                <th>Status</th>
                                <th>Assigned To</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.length > 0 ? (
                                tasks.map((t) => (
                                    <tr key={t._id}>
                                        <td className={styles.projectName}>{t.name}</td>
                                        <td>{t.projectId?.name || '-'}</td>
                                        <td>{t.detail}</td>
                                        <td>{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '-'}</td>
                                        <td><span className={`${styles.status} ${styles[t.status]}`}>{t.status}</span></td>
                                        <td>{t.assignedTo?.name || '-'}</td>
                                        <td>
                                            {user.role === 'admin' && (
                                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                                    <button onClick={() => handleEdit(t)} style={{ padding: '6px 10px', fontSize: '12px', cursor: 'pointer', background: '#0066cc', color: 'white', border: 'none', borderRadius: '4px' }}>Edit</button>
                                                    <button onClick={() => handleDelete(t._id)} style={{ padding: '6px 10px', fontSize: '12px', cursor: 'pointer', background: '#cc0000', color: 'white', border: 'none', borderRadius: '4px' }}>Delete</button>
                                                    <button onClick={() => handleAssignClick(t)} style={{ padding: '6px 10px', fontSize: '12px', cursor: 'pointer', background: '#009900', color: 'white', border: 'none', borderRadius: '4px' }}>Assign</button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>No tasks found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {showForm && (
                <Modal onClose={() => setShowForm(false)}>
                    <TaskForm
                        initial={editing || {}}
                        onCancel={() => setShowForm(false)}
                        onSave={handleSave}
                    />
                </Modal>
            )}
            {showAssign && assigningTask && (
                <TaskAssignModal task={assigningTask} onCancel={() => setShowAssign(false)} onAssign={handleAssign} />
            )}
        </div>
    );
}
