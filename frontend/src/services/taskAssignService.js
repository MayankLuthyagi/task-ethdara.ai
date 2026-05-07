import api from '../utils/api';

export async function assignTask(payload) {
    return api.request('/task-assign', { method: 'POST', body: JSON.stringify(payload) });
}

export async function getMyTasks() {
    return api.request('/task-assign/my-tasks/list');
}

export async function updateMyTaskStatus(id, status) {
    return api.request(`/task-assign/my-tasks/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
}

export default { assignTask, getMyTasks, updateMyTaskStatus };
