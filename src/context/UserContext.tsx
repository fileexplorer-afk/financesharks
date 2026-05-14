import React, { createContext, useState } from 'react';
import { mockUser } from '@/services/mockData';
import type { User } from '@/types';

interface UserContextType {
  user: User;
  updateUser: (user: User) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(mockUser);

  return (
    <UserContext.Provider
      value={{
        user,
        updateUser: setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
