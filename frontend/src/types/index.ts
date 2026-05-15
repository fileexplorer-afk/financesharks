/* Core Types */
export type Tier = 'free' | 'standard' | 'premium';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  tier: Tier;
  joinedAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  tier: Tier;
  status: 'active' | 'cancelled' | 'expired';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  price: number;
}

/* Financial Types */
export interface Account {
  id: string;
  name: string;
  type: 'savings' | 'current' | 'investment' | 'credit';
  balance: number;
  currency: 'INR' | 'USD' | 'EUR' | 'GBP';
  accountNumber?: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  category: 'salary' | 'food' | 'transport' | 'shopping' | 'utilities' | 'entertainment' | 'other';
  date: string;
  status: 'completed' | 'pending' | 'failed';
  tags?: string[];
}

export interface RecurringPayment {
  id: string;
  accountId: string;
  recipient: string;
  amount: number;
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  nextDueDate: string;
  status: 'active' | 'paused' | 'completed';
  createdAt: string;
}

export interface Holding {
  id: string;
  name: string;
  type: 'stock' | 'mutual-fund' | 'crypto' | 'bond';
  symbol: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
  currency: string;
  purchaseDate: string;
}

export interface Portfolio {
  id: string;
  userId: string;
  totalValue: number;
  currency: string;
  holdings: Holding[];
  gainLoss: number;
  gainLossPercent: number;
  lastUpdated: string;
}

export interface FinancialGoal {
  id: string;
  userId: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: 'savings' | 'investment' | 'debt-payoff' | 'emergency-fund';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export interface Budget {
  id: string;
  userId: string;
  category: string;
  monthlyLimit: number;
  spent: number;
  month: string;
  alerts: boolean;
  alertThreshold: number; // percentage
}

export interface SpendingTip {
  id: string;
  title: string;
  description: string;
  category: string;
  potentialSavings: number;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
}

export interface MarketInsight {
  id: string;
  symbol: string;
  title: string;
  description: string;
  recommendation: 'buy' | 'hold' | 'sell';
  changePercent: number;
  targetPrice?: number;
  timestamp: string;
}

/* Family Collaboration */
export interface FamilyMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'member';
  joinedAt: string;
  permissions: string[];
}

export interface FamilyHousehold {
  id: string;
  name: string;
  owner: string;
  members: FamilyMember[];
  sharedBudget: Budget;
  createdAt: string;
}

/* Feature Gating */
export type FeatureKey =
  | 'unlimited-transactions'
  | 'portfolio-management'
  | 'recurring-payments'
  | 'advanced-analytics'
  | 'budget-tracking'
  | 'ai-insights'
  | 'smart-spending'
  | 'family-collaboration'
  | 'multi-currency'
  | 'api-access'
  | 'tax-reports'
  | 'priority-support';

export interface FeatureConfig {
  feature: FeatureKey;
  tiers: Tier[];
  limit?: number;
  description: string;
}
