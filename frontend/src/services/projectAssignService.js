import api from '../utils/api';

export async function getAllAssigned() {
    return api.request('/project-assign');
}

export async function getTeamMembers() {
    return api.request('/project-assign/team/members');
}

export async function getAssignedByUser(userId) {
    return api.request(`/project-assign/user/${userId}`);
}

export async function getProjectMembers(projectId) {
    return api.request(`/project-assign/project/${projectId}`);
}

export async function assignProject(payload) {
    return api.request('/project-assign', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}

export async function updateAssign(id, payload) {
    return api.request(`/project-assign/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
    });
}

export async function deleteAssign(id) {
    return api.request(`/project-assign/${id}`, { method: 'DELETE' });
}

export async function getMyProjects() {
    return api.request('/project-assign/my-project/list');
}

export async function updateMyProjectStatus(id, status) {
    return api.request(`/project-assign/my-project/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
    });
}

export default {
    getAllAssigned,
    getAssignedByUser,
    getProjectMembers,
    assignProject,
    updateAssign,
    deleteAssign,
    getMyProjects,
    updateMyProjectStatus
};
