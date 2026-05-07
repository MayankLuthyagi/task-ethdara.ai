import api from '../utils/api';

export async function getSummary() {
    return api.request('/dashboard/summary');
}

export async function getMySummary() {
    return api.request('/dashboard/my-summary');
}

export default { getSummary, getMySummary };
