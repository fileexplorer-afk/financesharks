import React, { createContext, useState } from 'react';
import { mockFamilyMembers } from '@/services/mockData';
import type { FamilyMember } from '@/types';

interface FamilyContextType {
  members: FamilyMember[];
  addMember: (member: FamilyMember) => void;
  removeMember: (memberId: string) => void;
  updateMember: (member: FamilyMember) => void;
}

export const FamilyContext = createContext<FamilyContextType | undefined>(undefined);

export function FamilyProvider({ children }: { children: React.ReactNode }) {
  const [members, setMembers] = useState<FamilyMember[]>(mockFamilyMembers);

  const addMember = (member: FamilyMember) => {
    setMembers([...members, member]);
  };

  const removeMember = (memberId: string) => {
    setMembers(members.filter(m => m.id !== memberId));
  };

  const updateMember = (member: FamilyMember) => {
    setMembers(members.map(m => (m.id === member.id ? member : m)));
  };

  return (
    <FamilyContext.Provider
      value={{
        members,
        addMember,
        removeMember,
        updateMember,
      }}
    >
      {children}
    </FamilyContext.Provider>
  );
}
