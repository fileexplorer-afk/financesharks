import React, { createContext, useState } from 'react';
import type { Tier, Subscription } from '@/types';

interface SubscriptionContextType {
  tier: Tier;
  subscription: Subscription | null;
  setTier: (tier: Tier) => void;
  updateSubscription: (subscription: Subscription) => void;
}

export const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [tier, setTier] = useState<Tier>('free');
  const [subscription, setSubscription] = useState<Subscription | null>({
    id: 'sub-1',
    userId: 'user-1',
    tier: 'free',
    status: 'active',
    currentPeriodStart: '2026-05-01',
    currentPeriodEnd: '2026-06-01',
    price: 29.99,
  });

  return (
    <SubscriptionContext.Provider
      value={{
        tier,
        subscription,
        setTier,
        updateSubscription: setSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}
