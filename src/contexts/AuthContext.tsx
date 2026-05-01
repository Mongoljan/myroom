"use client";

import React, { createContext, useCallback, useContext, useMemo, useState, useEffect, ReactNode } from 'react';
import { CustomerService } from '@/services/customerApi';
import { CustomerProfile } from '@/types/customer';

interface AuthContextType {
  user: CustomerProfile | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    gender?: 'male' | 'female' | 'other';
    date_of_birth?: string;
    password: string;
    confirm_password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CustomerProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user profile on mount
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = CustomerService.getToken();
      if (savedToken) {
        try {
          const profile = await CustomerService.getProfile(savedToken);
          setUser(profile);
          setToken(savedToken);
        } catch {
          // Saved token is expired or invalid — silently clear it
          CustomerService.clearToken();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await CustomerService.login({ email, password });
      CustomerService.saveToken(response.token);
      setToken(response.token);

      // Fetch full profile
      const profile = await CustomerService.getProfile(response.token);
      setUser(profile);
    } catch (error) {
      throw error;
    }
  }, []);

  const register = useCallback(async (data: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    gender?: 'male' | 'female' | 'other';
    date_of_birth?: string;
    password: string;
    confirm_password: string;
  }) => {
    try {
      const response = await CustomerService.register(data);
      CustomerService.saveToken(response.token);
      setToken(response.token);

      // Fetch full profile
      const profile = await CustomerService.getProfile(response.token);
      setUser(profile);
    } catch (error) {
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      if (token) {
        await CustomerService.logout(token);
      }
    } catch {
      // ignore logout API errors — always clear local state
    } finally {
      CustomerService.clearToken();
      setUser(null);
      setToken(null);
    }
  }, [token]);

  const refreshProfile = useCallback(async () => {
    if (token) {
      try {
        const profile = await CustomerService.getProfile(token);
        setUser(profile);
      } catch {
        // silent fail — user stays logged in with stale profile
      }
    }
  }, [token]);

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: !!user && !!token,
      login,
      register,
      logout,
      refreshProfile,
    }),
    [user, token, isLoading, login, register, logout, refreshProfile]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
