import api from '../utils/api';

export async function fetchUsers() {
    return api.request('/users');
}

export async function createUser(userData) {
    return api.request('/auth/users', {
        method: 'POST',
        body: JSON.stringify(userData),
    });
}

export async function updateUser(userId, userData) {
    return api.request(`/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
    });
}

export async function deleteUser(userId) {
    return api.request(`/users/${userId}`, {
        method: 'DELETE',
    });
}

export default { fetchUsers, createUser, updateUser, deleteUser };
