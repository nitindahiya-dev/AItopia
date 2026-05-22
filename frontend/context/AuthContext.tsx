//frontend/context/authContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from './ToastContext';

interface User {
  id: number;
  name: string;
  email: string;
  token: string;
  subscription?: {
    plan: string;
    selectedTools: string[];
    status: string;
    startDate?: string;
    endDate?: string;
  };
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: (showToast?: boolean) => void;
  updateUserSubscription: (subscription: { plan: string; selectedTools: string[]; status: string }) => void;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const { success, error: toastError } = useToast();

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login with:', { email });
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      console.log('Login response:', { status: res.status, data });
      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      const userData: User = {
        id: data.user?.id || data.userId,
        name: data.user?.name || 'Unknown',
        email: data.user?.email || email,
        token: data.token,
        subscription: data.user?.subscription || {
          plan: 'starter',
          selectedTools: [],
          status: 'inactive',
        },
      };

      setUser(userData);
      localStorage.setItem('token', data.token);
      await refreshUserProfile(); // Ensure latest profile data after login
      success('Login successful');
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof Error) {
        toastError(error.message || 'Login failed. Please try again.');
      } else {
        toastError('Login failed. Please try again.');
      }
      throw error;
    }
  };

  const logout = (showToast = true) => {
    setUser(null);
    localStorage.removeItem('token');
    if (showToast) {
      success('Logged out successfully');
    }
  };

  const updateUserSubscription = (subscription: { plan: string; selectedTools: string[]; status: string }) => {
    if (user) {
      setUser({ ...user, subscription: { ...subscription, startDate: user.subscription?.startDate, endDate: user.subscription?.endDate } });
    }
  };

  const refreshUserProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      console.log('Profile refresh response:', data);
      if (res.ok) {
        const subscriptionData = {
          plan: data.plan || user?.subscription?.plan || 'starter',
          selectedTools: data.selectedTools || user?.subscription?.selectedTools || [],
          status: data.subscriptionStatus || user?.subscription?.status || 'inactive',
          startDate: data.subscriptionStartDate || user?.subscription?.startDate,
          endDate: data.subscriptionEndDate || user?.subscription?.endDate,
        };
        setUser({
          id: data.id || user?.id || 0,
          name: data.name || user?.name || 'Unknown',
          email: data.email || user?.email || '',
          token,
          subscription: subscriptionData,
        });
      } else {
        console.error('Failed to refresh profile:', data.message);
        toastError('Session expired. Please log in again.');
        logout(false);
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
      logout(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Found token, refreshing profile');
      refreshUserProfile();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUserSubscription, refreshUserProfile }}>
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