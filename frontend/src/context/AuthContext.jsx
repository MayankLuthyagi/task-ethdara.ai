import React, { createContext, useEffect, useState } from 'react';
import * as authService from '../services/authService';
import api from '../utils/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [loading, setLoading] = useState(Boolean(token));

    useEffect(() => {
        if (token) {
            api.setAuthToken(token);
            authService.getMe()
                .then((res) => setUser(res.data))
                .catch(() => {
                    setUser(null);
                    setToken(null);
                    localStorage.removeItem('token');
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = async (email, password) => {
        const res = await authService.login(email, password);
        const t = res.token;
        localStorage.setItem('token', t);
        api.setAuthToken(t);
        setToken(t);
        setUser(res.user);
        return res;
    };

    const signup = async (name, email, password, role) => {
        const res = await authService.signup(name, email, password, role);
        return res;
    };

    const logout = () => {
        localStorage.removeItem('token');
        api.setAuthToken(null);
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout, signup }}>
            {children}
        </AuthContext.Provider>
    );
}
