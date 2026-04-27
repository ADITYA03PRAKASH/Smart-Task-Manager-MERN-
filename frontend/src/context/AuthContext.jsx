import { createContext, useContext, useState, useEffect } from 'react';
import { getMeApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while verifying token on mount

  // Verify stored token once on app load
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('taskflow_token');
      if (token) {
        try {
          const { data } = await getMeApi();
          setUser(data.data.user);
        } catch {
          localStorage.removeItem('taskflow_token');
          localStorage.removeItem('taskflow_user');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('taskflow_token', token);
    localStorage.setItem('taskflow_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('taskflow_token');
    localStorage.removeItem('taskflow_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
