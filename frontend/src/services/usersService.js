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

export default { fetchUsers, createUser };
