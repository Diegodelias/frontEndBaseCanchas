import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';
import { AuthMode, UserProfile } from '../types/user';

interface AuthContextValue {
  authMode: AuthMode;
  user: UserProfile | null;
  isLoading: boolean;
  setAuthMode: (mode: AuthMode) => void;
  toggleDemoAuth: () => void;
  sendMagicLink: (email: string) => Promise<{ success: boolean; message: string }>;
  loginAsDemoUser: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authMode, setAuthModeState] = useState<AuthMode>('registered'); // default to registered for rich demo, easily toggled
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadUser = async (mode: AuthMode) => {
    setIsLoading(true);
    try {
      const profile = await authService.getCurrentUser(mode);
      setUser(profile);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUser(authMode);
  }, [authMode]);

  const setAuthMode = (mode: AuthMode) => {
    setAuthModeState(mode);
  };

  const toggleDemoAuth = () => {
    setAuthModeState((prev) => (prev === 'registered' ? 'guest' : 'registered'));
  };

  const sendMagicLink = async (email: string) => {
    const result = await authService.sendMagicLink(email);
    return result;
  };

  const loginAsDemoUser = async () => {
    setAuthModeState('registered');
    await loadUser('registered');
  };

  const logout = () => {
    setAuthModeState('guest');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        authMode,
        user,
        isLoading,
        setAuthMode,
        toggleDemoAuth,
        sendMagicLink,
        loginAsDemoUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
