import type { Tier } from '@/types';

export const PRICING_CONFIG: Record<Tier, { name: string; price: number; description: string }> = {
  free: {
    name: 'Free',
    price: 0,
    description: 'Perfect for getting started',
  },
  standard: {
    name: 'Standard',
    price: 9.99,
    description: 'For serious investors',
  },
  premium: {
    name: 'Premium',
    price: 29.99,
    description: 'For the dedicated investor',
  },
};

export const TIER_COLORS: Record<Tier, { bg: string; text: string; badge: string }> = {
  free: {
    bg: 'bg-slate-900',
    text: 'text-slate-300',
    badge: 'bg-slate-700 text-slate-100',
  },
  standard: {
    bg: 'bg-blue-900',
    text: 'text-blue-300',
    badge: 'bg-blue-700 text-blue-100',
  },
  premium: {
    bg: 'bg-amber-900',
    text: 'text-amber-300',
    badge: 'bg-amber-700 text-amber-100',
  },
};

export const TRANSACTION_CATEGORIES = [
  'salary',
  'food',
  'transport',
  'shopping',
  'utilities',
  'entertainment',
  'other',
] as const;

export const ACCOUNT_TYPES = [
  'savings',
  'current',
  'investment',
  'credit',
] as const;

export const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
] as const;

export const GOAL_CATEGORIES = [
  'savings',
  'investment',
  'debt-payoff',
  'emergency-fund',
] as const;

export const PAYMENT_FREQUENCIES = [
  'weekly',
  'monthly',
  'quarterly',
  'yearly',
] as const;

export const HOLDING_TYPES = [
  'stock',
  'mutual-fund',
  'crypto',
  'bond',
] as const;

export const DEMO_USER_EMAIL = 'demo@financesharks.com';
export const DEMO_USER_NAME = 'Raghav Singh';
