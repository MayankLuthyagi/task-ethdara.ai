import React, { useEffect, useState } from 'react';
import * as projectService from '../services/projectService';

export default function TaskForm({ initial = {}, onCancel, onSave }) {
  const [name, setName] = useState(initial.name || '');
  const [detail, setDetail] = useState(initial.detail || '');
  const [projectId, setProjectId] = useState(initial.projectId || '');
  const [dueDate, setDueDate] = useState(initial.dueDate ? initial.dueDate.split('T')[0] : '');
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    projectService.fetchProjects().then((res) => setProjects(res.data || [])).catch(() => {});
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name: name.trim(), detail: detail.trim(), projectId, dueDate: dueDate || undefined });
  };

  return (
    <div className="modal">
      <form className="modal-content" onSubmit={handleSubmit}>
        <h3>{initial._id ? 'Edit Task' : 'Create Task'}</h3>
        <div>
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Detail</label>
          <textarea value={detail} onChange={(e) => setDetail(e.target.value)} required />
        </div>
        <div>
          <label>Project</label>
          <select value={projectId} onChange={(e) => setProjectId(e.target.value)} required>
            <option value="">Select project</option>
            {projects.map((p) => (<option key={p._id} value={p._id}>{p.name}</option>))}
          </select>
        </div>
        <div>
          <label>Due date</label>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </div>
        <div style={{ marginTop: 8 }}>
          <button type="button" onClick={onCancel}>Cancel</button>
          <button type="submit">Save</button>
        </div>
      </form>
    </div>
  );
}
