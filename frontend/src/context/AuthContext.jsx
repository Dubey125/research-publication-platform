import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api, { clearAccessToken, setAccessToken } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    const item = localStorage.getItem('ijtse_admin');
    return item ? JSON.parse(item) : null;
  });

  const [token, setToken] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        const { data } = await api.post('/auth/refresh');
        if (data?.token) {
          setAccessToken(data.token);
          setToken(data.token);
          const me = await api.get('/auth/me');
          if (me?.data?.admin) {
            setAdmin(me.data.admin);
            localStorage.setItem('ijtse_admin', JSON.stringify(me.data.admin));
          }
        }
      } catch (_error) {
        clearAccessToken();
        setToken(null);
        setAdmin(null);
        localStorage.removeItem('ijtse_admin');
      } finally {
        setIsAuthLoading(false);
      }
    };

    bootstrapAuth();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    setAdmin(data.admin);
    setToken(data.token);
    setAccessToken(data.token);
    localStorage.setItem('ijtse_admin', JSON.stringify(data.admin));
  };

  const logout = () => {
    api.post('/auth/logout').catch(() => {
      // Best-effort server-side token revocation.
    });
    clearAccessToken();
    setAdmin(null);
    setToken(null);
    localStorage.removeItem('ijtse_admin');
  };

  const value = useMemo(() => ({ admin, token, login, logout, isAuthenticated: !!token, isAuthLoading }), [admin, token, isAuthLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
