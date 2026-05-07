import api from '../utils/api';

export async function login(email, password) {
    return api.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });
}

export async function signup(name, email, password, role = 'member') {
    return api.request('/auth/users', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role })
    });
}

export async function getMe() {
    return api.request('/users/me');
}
