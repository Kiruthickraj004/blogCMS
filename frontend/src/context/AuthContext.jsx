import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import api, { initCsrf } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      await initCsrf(); // Ensure CSRF token is initialized
      const { data } = await api.get('/user');
      setUser(data.user);
    } catch (error) {
      // 401 is expected when user is not logged in
      if (error.response?.status !== 401) {
        console.error('Error fetching user:', error);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email, password, remember = false) => {
    await initCsrf(); // Ensure CSRF token is initialized
    const { data } = await api.post('/login', { email, password, remember });
    setUser(data.user);
    return data.user;
  };

  const register = async (form) => {
    await initCsrf(); // Ensure CSRF token is initialized
    const { data } = await api.post('/register', form);
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    await api.post('/logout');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    refreshUser: fetchUser,
    isAdmin: user?.role === 'admin',
    isAuthor: user?.role === 'author',
    isViewer: user?.role === 'viewer',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
