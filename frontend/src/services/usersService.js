import api from '../utils/api';

export async function fetchUsers() {
    return api.request('/users');
}

export default { fetchUsers };
