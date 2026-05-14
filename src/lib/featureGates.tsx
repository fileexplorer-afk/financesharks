import type { Tier, FeatureKey, FeatureConfig } from '@/types';

const featureConfigMap: Record<FeatureKey, FeatureConfig> = {
  'unlimited-transactions': {
    feature: 'unlimited-transactions',
    tiers: ['standard', 'premium'],
    limit: 100,
    description: 'View unlimited transactions (free tier limited to 100)',
  },
  'portfolio-management': {
    feature: 'portfolio-management',
    tiers: ['standard', 'premium'],
    description: 'Full portfolio management with rebalancing suggestions',
  },
  'recurring-payments': {
    feature: 'recurring-payments',
    tiers: ['standard', 'premium'],
    limit: 5,
    description: 'Setup recurring payments (free tier: up to 5, premium: unlimited)',
  },
  'advanced-analytics': {
    feature: 'advanced-analytics',
    tiers: ['standard', 'premium'],
    description: 'Advanced analytics and spending breakdown',
  },
  'budget-tracking': {
    feature: 'budget-tracking',
    tiers: ['standard', 'premium'],
    description: 'Budget tracking with alerts and notifications',
  },
  'ai-insights': {
    feature: 'ai-insights',
    tiers: ['premium'],
    description: 'AI-powered market insights and recommendations',
  },
  'smart-spending': {
    feature: 'smart-spending',
    tiers: ['premium'],
    description: 'Smart spending suggestions to achieve financial goals',
  },
  'family-collaboration': {
    feature: 'family-collaboration',
    tiers: ['premium'],
    limit: 5,
    description: 'Family collaboration (2-5 members per household)',
  },
  'multi-currency': {
    feature: 'multi-currency',
    tiers: ['premium'],
    description: 'Multi-currency support',
  },
  'api-access': {
    feature: 'api-access',
    tiers: ['premium'],
    description: 'API access for integrations',
  },
  'tax-reports': {
    feature: 'tax-reports',
    tiers: ['premium'],
    description: 'Advanced tax reporting',
  },
  'priority-support': {
    feature: 'priority-support',
    tiers: ['premium'],
    description: 'Priority support with badge',
  },
};

export function hasFeature(tier: Tier, feature: FeatureKey): boolean {
  const config = featureConfigMap[feature];
  if (!config) return false;
  return config.tiers.includes(tier);
}

export function getAllFeatures(): FeatureKey[] {
  return Object.keys(featureConfigMap) as FeatureKey[];
}

export function getFeaturesByTier(tier: Tier): FeatureKey[] {
  return getAllFeatures().filter(feature => hasFeature(tier, feature));
}

export function getFeatureConfig(feature: FeatureKey): FeatureConfig | undefined {
  return featureConfigMap[feature];
}

export function getFeatureLimit(tier: Tier, feature: FeatureKey): number | undefined {
  const config = featureConfigMap[feature];
  if (!config || !hasFeature(tier, feature)) return undefined;
  return config.limit;
}

export interface FeatureGateProps {
  feature: FeatureKey;
  tier: Tier;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function FeatureGate({ feature, tier, fallback, children }: FeatureGateProps) {
  if (!hasFeature(tier, feature)) {
    return <>{fallback}</>;
  }
  return <>{children}</>;
}
