import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isStaff: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: any) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  updateCurrentUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('comfort_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('comfort_token') || null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('comfort_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('comfort_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('comfort_token', token);
    } else {
      localStorage.removeItem('comfort_token');
    }
  }, [token]);

  const login = async (email: string, pass: string) => {
    try {
      const res = await api.login(email, pass);
      if (res.success && res.user) {
        setUser(res.user);
        setToken(res.token || 'token-logged-in');
        return { success: true };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  };

  const register = async (data: any) => {
    try {
      const res = await api.register(data);
      if (res.success && res.user) {
        setUser(res.user);
        setToken(res.token || 'token-registered');
        return { success: true };
      }
      return { success: false, message: res.message || 'Registration failed' };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const switchRole = (role: UserRole) => {
    if (user) {
      const updated = { ...user, role };
      setUser(updated);
    } else {
      // Create temporary mock user for testing that role
      const tempUser: User = {
        id: `usr-temp-${role}`,
        name: role === 'super_admin' ? 'Super Admin' : role.replace('_', ' ').toUpperCase(),
        email: `${role}@comfort.pk`,
        role,
        status: 'active',
        createdAt: new Date().toISOString(),
      };
      setUser(tempUser);
      setToken(`token-${role}`);
    }
  };

  const updateCurrentUser = (u: User) => {
    setUser(u);
  };

  const isSuperAdmin = user?.role === 'super_admin';
  const isAdmin = user?.role === 'super_admin' || user?.role === 'admin';
  const isStaff = !!user && user.role !== 'customer';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAdmin,
        isSuperAdmin,
        isStaff,
        login,
        register,
        logout,
        switchRole,
        updateCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
