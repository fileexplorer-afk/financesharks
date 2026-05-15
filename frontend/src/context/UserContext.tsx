import React, { createContext, useEffect, useState, useContext } from 'react';
import { AuthContext } from './AuthContext';

interface UserContextType {
  user: {
    id: string;
    name: string;
    email: string;
    tier: string;
    avatarUrl: string | null;
    joinedAt: string;
    [key: string]: unknown;
  };
  updateUser: (user: Partial<UserContextType['user']>) => void;
}

const defaultUser = {
  id: '',
  name: 'User',
  email: '',
  tier: 'free',
  avatarUrl: null as string | null,
  joinedAt: new Date().toISOString().split('T')[0],
};

export const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const auth = useContext(AuthContext);
  const [user, setUser] = useState(defaultUser);

  useEffect(() => {
    if (auth?.user) {
      setUser({
        id: auth.user.id,
        name: auth.user.name,
        email: auth.user.email,
        tier: auth.user.tier,
        avatarUrl: auth.user.avatarUrl,
        joinedAt: auth.user.createdAt || new Date().toISOString().split('T')[0],
      });
    }
  }, [auth?.user]);

  return (
    <UserContext.Provider value={{ user, updateUser: (u) => setUser(prev => ({ ...prev, ...u })) }}>
      {children}
    </UserContext.Provider>
  );
}
