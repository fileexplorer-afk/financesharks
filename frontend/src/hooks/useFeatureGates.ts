import { useContext } from 'react';
import { SubscriptionContext } from '@/context/SubscriptionContext';
import { hasFeature, getFeaturesByTier, getFeatureLimit } from '@/lib/featureGates';
import type { FeatureKey } from '@/types';

export function useFeatureGates() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useFeatureGates must be used within SubscriptionProvider');
  }

  const { tier } = context;

  return {
    tier,
    hasFeature: (feature: FeatureKey) => hasFeature(tier, feature),
    getFeatures: () => getFeaturesByTier(tier),
    getLimit: (feature: FeatureKey) => getFeatureLimit(tier, feature),
  };
}
