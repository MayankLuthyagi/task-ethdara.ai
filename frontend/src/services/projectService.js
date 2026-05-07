import api from '../utils/api';

export async function fetchProjects() {
    return api.request('/projects');
}

export async function fetchProject(id) {
    return api.request(`/projects/${id}`);
}

export async function createProject(payload) {
    return api.request('/projects', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}

export async function updateProject(id, payload) {
    return api.request(`/projects/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
    });
}

export async function deleteProject(id) {
    return api.request(`/projects/${id}`, {
        method: 'DELETE'
    });
}

export default { fetchProjects, fetchProject, createProject, updateProject, deleteProject };
