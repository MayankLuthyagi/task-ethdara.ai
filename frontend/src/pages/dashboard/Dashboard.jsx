import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import * as dashboardService from '../../services/dashboardService';
import * as projectService from '../../services/projectService';
import * as taskService from '../../services/taskService';
import * as taskAssignService from '../../services/taskAssignService';
import * as projectAssignService from '../../services/projectAssignService';
import * as usersService from '../../services/usersService';
import ProjectForm from '../../components/ProjectForm';
import TaskForm from '../../components/TaskForm';
import TaskAssignModal from '../../components/TaskAssignModal';
import AssignMemberForm from '../../components/AssignMemberForm';
import MemberForm from '../../components/MemberForm';
import styles from './Dashboard.module.css';

function StatCard({ title, value }) {
    return (
        <div className="card">
            <h3>{title}</h3>
            <div className="stat-value">{value}</div>
        </div>
    );
}

export default function Dashboard() {
    const { user } = useAuth() || {};
    const [data, setData] = useState(null);
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showProjectForm, setShowProjectForm] = useState(false);
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [showAssignForm, setShowAssignForm] = useState(false);
    const [showMemberForm, setShowMemberForm] = useState(false);
    const [showTaskAssign, setShowTaskAssign] = useState(false);
    const [assigningTask, setAssigningTask] = useState(null);

    useEffect(() => {
        setLoading(true);
        const fn = user?.role === 'admin' ? dashboardService.getSummary : dashboardService.getMySummary;
        const loadData = async () => {
            try {
                const res = await fn();
                setData(res.data);
                const projectRes = await projectService.fetchProjects();
                setProjects(projectRes.data || []);
                const taskRes = await taskService.fetchTasks();
                setTasks(taskRes.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [user]);

    const handleProjectSave = async (formData) => {
        try {
            await projectService.createProject(formData);
            setShowProjectForm(false);
            // Refresh dashboard
            const fn = user?.role === 'admin' ? dashboardService.getSummary : dashboardService.getMySummary;
            const res = await fn();
            setData(res.data);
        } catch (err) {
            console.error('Error creating project:', err);
            alert('Failed to create project');
        }
    };

    const handleTaskSave = async (formData) => {
        try {
            await taskService.createTask(formData);
            setShowTaskForm(false);
            // Refresh dashboard
            const fn = user?.role === 'admin' ? dashboardService.getSummary : dashboardService.getMySummary;
            const res = await fn();
            setData(res.data);
        } catch (err) {
            console.error('Error creating task:', err);
            alert('Failed to create task');
        }
    };

    const handleAssignSave = async (formData) => {
        try {
            await projectAssignService.assignProject(formData);
            setShowAssignForm(false);
            // Refresh dashboard
            const fn = user?.role === 'admin' ? dashboardService.getSummary : dashboardService.getMySummary;
            const res = await fn();
            setData(res.data);
        } catch (err) {
            console.error('Error assigning project:', err);
            alert('Failed to assign project');
        }
    };

    const handleMemberSave = async (formData) => {
        try {
            await usersService.createUser(formData);
            setShowMemberForm(false);
            // Refresh dashboard
            const fn = user?.role === 'admin' ? dashboardService.getSummary : dashboardService.getMySummary;
            const res = await fn();
            setData(res.data);
        } catch (err) {
            console.error('Error creating member:', err);
            alert('Failed to create member');
        }
    };

    const handleTaskAssignClick = (task) => {
        setAssigningTask(task);
        setShowTaskAssign(true);
    };

    const handleTaskAssign = async (payload) => {
        try {
            await taskAssignService.assignTask(payload);
            setShowTaskAssign(false);
            // Refresh tasks
            const taskRes = await taskService.fetchTasks();
            setTasks(taskRes.data || []);
        } catch (err) {
            console.error('Error assigning task:', err);
            alert(err.message || 'Failed to assign task');
        }
    };

    const getProjectTasks = (projectId) => {
        return tasks.filter(t => t.projectId?._id === projectId);
    };

    if (!user) return null;

    return (
        <div>
            <div className={styles.dashboardHeader}>
                <div>
                    <h2>Dashboard</h2>
                </div>
                {user?.role === 'admin' && (
                    <div className={styles.addButtonsContainer}>
                        <button className={styles.addBtn} onClick={() => setShowProjectForm(true)}>
                            + Add Project
                        </button>
                        <button className={styles.addBtn} onClick={() => setShowTaskForm(true)}>
                            + Add Task
                        </button>
                        <button className={styles.addBtn} onClick={() => setShowMemberForm(true)}>
                            + Add Member
                        </button>
                        <button className={styles.addBtn} onClick={() => setShowAssignForm(true)}>
                            + Assign Member
                        </button>
                    </div>
                )}
            </div>

            {loading && <div>Loading...</div>}
            {!loading && data && (
                <>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <div className="card">
                            <h3>Projects</h3>
                            <div className="stat-value">{data.totals?.projects ?? data.totals?.assignedProjects ?? 0}</div>
                        </div>
                        <div className="card">
                            <h3>Tasks</h3>
                            <div className="stat-value">{data.totals?.tasks ?? data.totals?.assignedTasks ?? 0}</div>
                        </div>
                        <div className="card">
                            <h3>Overdue</h3>
                            <div className="stat-value">{data.overdueTasks ?? 0}</div>
                        </div>
                        <div className="card">
                            <h3>Task Assignments</h3>
                            <div className="stat-value">{data.totals?.taskAssignments ?? 0}</div>
                        </div>
                        {Object.entries(data.taskStatus || {}).map(([k, v]) => (
                            <div key={k} className="card small">
                                <div style={{ textTransform: 'capitalize' }}>{k}</div>
                                <div className="stat-value">{v}</div>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: 30 }}>
                        <div className={styles.tableContainer}>
                            <table className={styles.projectTable}>
                                <thead>
                                    <tr>
                                        <th>Project</th>
                                        <th>Task</th>
                                        <th>Description</th>
                                        <th>Due Date</th>
                                        <th>Status</th>
                                        <th style={{ minWidth: '150px' }}>Assigned To</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projects.length > 0 ? (
                                        projects.map((project) => {
                                            const projectTasks = getProjectTasks(project._id);
                                            if (projectTasks.length === 0) {
                                                return (
                                                    <tr key={project._id}>
                                                        <td className={styles.projectName}>{project.name}</td>
                                                        <td colSpan="6" style={{ textAlign: 'center', color: '#999' }}>No tasks</td>
                                                    </tr>
                                                );
                                            }
                                            return projectTasks.map((task, idx) => (
                                                <tr key={task._id}>
                                                    {idx === 0 && <td className={styles.projectName} rowSpan={projectTasks.length}>{project.name}</td>}
                                                    <td>
                                                        <div style={{ fontWeight: '500' }}>{task.name}</div>
                                                        {task.assignedTo?.name && (
                                                            <div style={{ fontSize: '12px', color: '#0066cc', marginTop: '4px' }}>👤 {task.assignedTo.name}</div>
                                                        )}
                                                    </td>
                                                    <td>{task.detail}</td>
                                                    <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}</td>
                                                    <td><span className={`${styles.status} ${styles[task.status]}`}>{task.status}</span></td>
                                                    <td style={{ fontWeight: '500', color: '#0066cc' }}>
                                                        {task.assignedTo?.name ? (
                                                            <>
                                                                <div>{task.assignedTo.name}</div>
                                                                <div style={{ fontSize: '12px', color: '#666', fontWeight: '400' }}>{task.assignedTo.email || ''}</div>
                                                            </>
                                                        ) : '-'}
                                                    </td>
                                                    <td>
                                                        {user?.role === 'admin' && (
                                                            <button onClick={() => handleTaskAssignClick(task)} style={{ padding: '6px 10px', fontSize: '12px', cursor: 'pointer', background: '#009900', color: 'white', border: 'none', borderRadius: '4px' }}>Assign</button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ));
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>No projects found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {/* Modals */}
            {showProjectForm && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <ProjectForm
                            onCancel={() => setShowProjectForm(false)}
                            onSave={handleProjectSave}
                        />
                    </div>
                </div>
            )}

            {showTaskForm && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <TaskForm
                            onCancel={() => setShowTaskForm(false)}
                            onSave={handleTaskSave}
                        />
                    </div>
                </div>
            )}

            {showAssignForm && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <AssignMemberForm
                            onCancel={() => setShowAssignForm(false)}
                            onSave={handleAssignSave}
                        />
                    </div>
                </div>
            )}

            {showMemberForm && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <MemberForm
                            onCancel={() => setShowMemberForm(false)}
                            onSave={handleMemberSave}
                        />
                    </div>
                </div>
            )}

            {showTaskAssign && assigningTask && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <TaskAssignModal
                            task={assigningTask}
                            onCancel={() => setShowTaskAssign(false)}
                            onAssign={handleTaskAssign}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
