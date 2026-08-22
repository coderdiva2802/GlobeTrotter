import { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { AuthContext } from './authContextInstance';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('gt_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('gt_access_token');
    if (token && !user) {
      authService
        .getMe()
        .then((res) => {
          if (res?.data?.user) {
            setUser(res.data.user);
            localStorage.setItem('gt_user', JSON.stringify(res.data.user));
          }
        })
        .catch(() => {
          localStorage.removeItem('gt_access_token');
          localStorage.removeItem('gt_user');
          setUser(null);
        });
    }
  }, [user]);

  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const res = await authService.login(credentials);
      if (res?.data) {
        const { user: userData, tokens } = res.data;
        if (tokens?.accessToken) {
          localStorage.setItem('gt_access_token', tokens.accessToken);
          if (tokens.refreshToken) {
            localStorage.setItem('gt_refresh_token', tokens.refreshToken);
          }
        }
        setUser(userData);
        localStorage.setItem('gt_user', JSON.stringify(userData));
        return { success: true, user: userData };
      }
      return { success: false, message: res?.message || 'Login failed' };
    } catch (error) {
      return { success: false, message: error.message || 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    try {
      const res = await authService.register(userData);
      if (res?.data) {
        const { user: newUser, tokens } = res.data;
        if (tokens?.accessToken) {
          localStorage.setItem('gt_access_token', tokens.accessToken);
          if (tokens.refreshToken) {
            localStorage.setItem('gt_refresh_token', tokens.refreshToken);
          }
        }
        setUser(newUser);
        localStorage.setItem('gt_user', JSON.stringify(newUser));
        return { success: true, user: newUser };
      }
      return { success: false, message: res?.message || 'Registration failed' };
    } catch (error) {
      return { success: false, message: error.message || 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
