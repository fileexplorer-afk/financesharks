import { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import * as authApi from '@/services/api/auth.api';
import { setTokens, clearTokens, getAccessToken } from '@/services/api/client';

interface AuthState {
  user: authApi.UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<authApi.UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      authApi.getMe()
        .then(setUser)
        .catch(() => {
          clearTokens();
          setUser(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    setTokens(res.accessToken, res.refreshToken);
    setUser({ id: res.userId, name: res.name, email: res.email, tier: res.tier, role: res.role, avatarUrl: res.avatarUrl, createdAt: '' });
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const res = await authApi.register(name, email, password);
    setTokens(res.accessToken, res.refreshToken);
    setUser({ id: res.userId, name: res.name, email: res.email, tier: res.tier, role: res.role, avatarUrl: res.avatarUrl, createdAt: '' });
  }, []);

  const logout = useCallback(async () => {
    try {
      const refresh = localStorage.getItem('refreshToken');
      if (refresh) await authApi.logout(refresh);
    } catch { /* ignore */ }
    clearTokens();
    setUser(null);
    window.location.href = '/';
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
