import { createContext, useContext, useMemo, useState } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    const item = localStorage.getItem('ijaif_admin');
    return item ? JSON.parse(item) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('ijaif_admin_token'));

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    setAdmin(data.admin);
    setToken(data.token);
    localStorage.setItem('ijaif_admin', JSON.stringify(data.admin));
    localStorage.setItem('ijaif_admin_token', data.token);
  };

  const logout = () => {
    api.post('/auth/logout').catch(() => {
      // Best-effort server-side token revocation.
    });
    setAdmin(null);
    setToken(null);
    localStorage.removeItem('ijaif_admin');
    localStorage.removeItem('ijaif_admin_token');
  };

  const value = useMemo(() => ({ admin, token, login, logout, isAuthenticated: !!token }), [admin, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
