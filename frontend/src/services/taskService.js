import api from '../utils/api';

export async function fetchTasks() {
    return api.request('/tasks');
}

export async function fetchTask(id) {
    return api.request(`/tasks/${id}`);
}

export async function createTask(payload) {
    return api.request('/tasks', { method: 'POST', body: JSON.stringify(payload) });
}

export async function updateTask(id, payload) {
    return api.request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
}

export async function deleteTask(id) {
    return api.request(`/tasks/${id}`, { method: 'DELETE' });
}

export default { fetchTasks, fetchTask, createTask, updateTask, deleteTask };
