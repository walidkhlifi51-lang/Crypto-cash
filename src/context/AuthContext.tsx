import React, { createContext, useContext, useMemo, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { UserProfile } from '../types';

interface Credentials {
  emailOrPhone: string;
  password: string;
}

interface AuthContextValue {
  user: UserProfile | null;
  loading: boolean;
  login: (credentials: Credentials) => Promise<void>;
  register: (payload: Credentials & { displayName: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const demoUser: UserProfile = {
  id: 'demo-user',
  displayName: 'Demo Merchant',
  email: 'merchant@example.com',
  role: 'merchant',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(demoUser);
  const [loading, setLoading] = useState(false);

  const login = async ({ emailOrPhone, password }: Credentials) => {
    setLoading(true);
    // In production, call your backend to exchange credentials for a session token.
    await SecureStore.setItemAsync('session', JSON.stringify({ emailOrPhone, password }));
    setUser({ ...demoUser, email: emailOrPhone.includes('@') ? emailOrPhone : undefined, phone: emailOrPhone });
    setLoading(false);
  };

  const register = async ({ emailOrPhone, password, displayName }: Credentials & { displayName: string }) => {
    setLoading(true);
    // Store secure token returned by your backend after registration.
    await SecureStore.setItemAsync('session', JSON.stringify({ emailOrPhone, password }));
    setUser({ ...demoUser, displayName, email: emailOrPhone.includes('@') ? emailOrPhone : undefined, phone: emailOrPhone });
    setLoading(false);
  };

  const logout = async () => {
    setLoading(true);
    await SecureStore.deleteItemAsync('session');
    setUser(null);
    setLoading(false);
  };

  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
