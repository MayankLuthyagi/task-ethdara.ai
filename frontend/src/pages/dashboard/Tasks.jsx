import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import * as taskService from '../../services/taskService';
import * as taskAssignService from '../../services/taskAssignService';
import TaskForm from '../../components/TaskForm';
import TaskAssignModal from '../../components/TaskAssignModal';

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
      <h2>Tasks</h2>
      {user.role === 'admin' && <button onClick={handleCreate}>New Task</button>}
      {loading && <div>Loading...</div>}
      <div>
        {tasks.map((t) => (
          <div key={t._id} style={{ border: '1px solid #ddd', padding: 8, margin: 8 }}>
            <h3>{t.name}</h3>
            <p>{t.detail}</p>
            <div>Project: {t.projectId?.name}</div>
            <div>Due: {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '—'}</div>
            <div>Status: {t.status}</div>
            <div>Assigned to: {t.assignedTo?.name || '—'}</div>
            <div style={{ marginTop: 8 }}>
              {user.role === 'admin' && (
                <>
                  <button onClick={() => handleEdit(t)}>Edit</button>
                  <button onClick={() => handleDelete(t._id)}>Delete</button>
                  <button onClick={() => handleAssignClick(t)}>Assign</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {showForm && <TaskForm initial={editing || {}} onCancel={() => setShowForm(false)} onSave={handleSave} />}
      {showAssign && assigningTask && (
        <TaskAssignModal task={assigningTask} onCancel={() => setShowAssign(false)} onAssign={handleAssign} />
      )}
    </div>
  );
}
