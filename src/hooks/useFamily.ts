import { useContext } from 'react';
import { FamilyContext } from '@/context/FamilyContext';

export function useFamily() {
  const context = useContext(FamilyContext);
  if (!context) {
    throw new Error('useFamily must be used within FamilyProvider');
  }
  return context;
}
