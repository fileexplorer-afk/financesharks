import React, { createContext, useState, useEffect, useCallback } from 'react';
import * as familyApi from '@/services/api/family.api';

interface FamilyMemberDisplay {
  id: string;
  name: string;
  email: string;
  role: string;
  joinedAt: string;
  avatarUrl?: string | null;
}

interface FamilyContextType {
  members: FamilyMemberDisplay[];
  addMember: (member: FamilyMemberDisplay) => void;
  removeMember: (memberId: string) => void;
  updateMember: (member: FamilyMemberDisplay) => void;
  refresh: () => Promise<void>;
}

export const FamilyContext = createContext<FamilyContextType | undefined>(undefined);

export function FamilyProvider({ children }: { children: React.ReactNode }) {
  const [members, setMembers] = useState<FamilyMemberDisplay[]>([]);

  const refresh = useCallback(async () => {
    try {
      const apiMembers = await familyApi.getFamilyMembers();
      setMembers(apiMembers.map(m => ({
        id: m.id,
        name: m.name,
        email: m.email,
        role: m.role,
        joinedAt: m.createdAt ? new Date(m.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recently',
        avatarUrl: m.avatarUrl,
      })));
    } catch {
      setMembers([]);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return (
    <FamilyContext.Provider
      value={{
        members,
        addMember: (member) => setMembers(prev => [...prev, member]),
        removeMember: (memberId) => setMembers(prev => prev.filter(m => m.id !== memberId)),
        updateMember: (member) => setMembers(prev => prev.map(m => m.id === member.id ? member : m)),
        refresh,
      }}
    >
      {children}
    </FamilyContext.Provider>
  );
}
