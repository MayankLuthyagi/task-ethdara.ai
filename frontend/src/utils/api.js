const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

let authToken = null;
export const setAuthToken = (token) => { authToken = token; };

async function request(path, options = {}) {
    const url = `${API_BASE}${path}`;
    const headers = Object.assign({ 'Content-Type': 'application/json' }, options.headers || {});
    if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

    const res = await fetch(url, Object.assign({ headers }, options));
    const text = await res.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch (e) { data = text; }

    if (!res.ok) {
        const message = data && data.message ? data.message : res.statusText;
        const err = new Error(message || 'API request failed');
        err.status = res.status;
        err.data = data;
        throw err;
    }

    return data;
}

export default { request, setAuthToken };
