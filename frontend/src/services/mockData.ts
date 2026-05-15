import type {
  User,
  Account,
  Transaction,
  Holding,
  FinancialGoal,
  Budget,
  FamilyMember,
} from '@/types';

export const mockUser: User = {
  id: 'user-1',
  name: 'Raghav Singh',
  email: 'raghav@financesharks.com',
  tier: 'premium',
  joinedAt: '2024-01-15',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Raghav',
};

export const mockAccounts: Account[] = [
  {
    id: 'acc-1',
    name: 'Savings Account',
    type: 'savings',
    balance: 245000,
    currency: 'INR',
    accountNumber: '****1234',
    createdAt: '2023-06-01',
  },
  {
    id: 'acc-2',
    name: 'Current Account',
    type: 'current',
    balance: 85500,
    currency: 'INR',
    accountNumber: '****5678',
    createdAt: '2023-08-15',
  },
  {
    id: 'acc-3',
    name: 'Investment Account',
    type: 'investment',
    balance: 450000,
    currency: 'INR',
    accountNumber: '****9012',
    createdAt: '2023-10-01',
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: 'txn-1',
    accountId: 'acc-1',
    type: 'credit',
    amount: 75000,
    description: 'Monthly Salary',
    category: 'salary',
    date: '2026-05-01',
    status: 'completed',
  },
  {
    id: 'txn-2',
    accountId: 'acc-1',
    type: 'debit',
    amount: 1200,
    description: 'Grocery Shopping',
    category: 'food',
    date: '2026-05-12',
    status: 'completed',
  },
  {
    id: 'txn-3',
    accountId: 'acc-1',
    type: 'debit',
    amount: 450,
    description: 'Uber Rides',
    category: 'transport',
    date: '2026-05-10',
    status: 'completed',
  },
  {
    id: 'txn-4',
    accountId: 'acc-1',
    type: 'debit',
    amount: 2500,
    description: 'Amazon Purchase',
    category: 'shopping',
    date: '2026-05-08',
    status: 'completed',
  },
  {
    id: 'txn-5',
    accountId: 'acc-1',
    type: 'debit',
    amount: 1500,
    description: 'Electricity Bill',
    category: 'utilities',
    date: '2026-05-05',
    status: 'completed',
  },
  {
    id: 'txn-6',
    accountId: 'acc-1',
    type: 'debit',
    amount: 800,
    description: 'Movie Tickets',
    category: 'entertainment',
    date: '2026-05-03',
    status: 'completed',
  },
];

export const mockHoldings: Holding[] = [
  {
    id: 'hold-1',
    name: 'TCS Limited',
    type: 'stock',
    symbol: 'TCS',
    quantity: 10,
    buyPrice: 3500,
    currentPrice: 3850,
    currency: 'INR',
    purchaseDate: '2024-01-15',
  },
  {
    id: 'hold-2',
    name: 'Reliance Industries',
    type: 'stock',
    symbol: 'RELIANCE',
    quantity: 5,
    buyPrice: 2800,
    currentPrice: 2950,
    currency: 'INR',
    purchaseDate: '2024-02-20',
  },
  {
    id: 'hold-3',
    name: 'HDFC Bank',
    type: 'stock',
    symbol: 'HDFCBANK',
    quantity: 15,
    buyPrice: 1500,
    currentPrice: 1620,
    currency: 'INR',
    purchaseDate: '2024-03-10',
  },
  {
    id: 'hold-4',
    name: 'Axis Mutual Fund - Direct Growth',
    type: 'mutual-fund',
    symbol: 'AXISGRWTH',
    quantity: 100,
    buyPrice: 45,
    currentPrice: 52,
    currency: 'INR',
    purchaseDate: '2024-04-01',
  },
];

export const mockGoals: FinancialGoal[] = [
  {
    id: 'goal-1',
    userId: 'user-1',
    title: 'Emergency Fund',
    description: 'Build 6 months of living expenses',
    targetAmount: 500000,
    currentAmount: 350000,
    deadline: '2026-12-31',
    category: 'emergency-fund',
    priority: 'high',
    createdAt: '2024-01-01',
  },
  {
    id: 'goal-2',
    userId: 'user-1',
    title: 'Down Payment for House',
    description: 'Save for a house down payment',
    targetAmount: 2000000,
    currentAmount: 750000,
    deadline: '2028-06-30',
    category: 'savings',
    priority: 'high',
    createdAt: '2024-02-15',
  },
  {
    id: 'goal-3',
    userId: 'user-1',
    title: 'Vacation to Europe',
    description: 'Dream vacation fund',
    targetAmount: 300000,
    currentAmount: 125000,
    deadline: '2026-12-15',
    category: 'savings',
    priority: 'medium',
    createdAt: '2024-03-01',
  },
];

export const mockBudgets: Budget[] = [
  {
    id: 'bud-1',
    userId: 'user-1',
    category: 'food',
    monthlyLimit: 8000,
    spent: 3500,
    month: '2026-05',
    alerts: true,
    alertThreshold: 80,
  },
  {
    id: 'bud-2',
    userId: 'user-1',
    category: 'transport',
    monthlyLimit: 2000,
    spent: 1200,
    month: '2026-05',
    alerts: true,
    alertThreshold: 80,
  },
  {
    id: 'bud-3',
    userId: 'user-1',
    category: 'entertainment',
    monthlyLimit: 5000,
    spent: 2100,
    month: '2026-05',
    alerts: true,
    alertThreshold: 80,
  },
  {
    id: 'bud-4',
    userId: 'user-1',
    category: 'utilities',
    monthlyLimit: 4000,
    spent: 3200,
    month: '2026-05',
    alerts: true,
    alertThreshold: 80,
  },
];

export const mockFamilyMembers: FamilyMember[] = [
  {
    id: 'member-1',
    name: 'Raghav Singh',
    email: 'raghav@financesharks.com',
    role: 'owner',
    joinedAt: '2024-01-15',
    permissions: ['all'],
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Raghav',
  },
  {
    id: 'member-2',
    name: 'Priya Singh',
    email: 'priya@financesharks.com',
    role: 'member',
    joinedAt: '2024-06-01',
    permissions: ['view', 'spend', 'transaction'],
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
  },
];

// Get total portfolio value
export function getTotalPortfolioValue(): number {
  return mockHoldings.reduce((sum, holding) => {
    return sum + holding.quantity * holding.currentPrice;
  }, 0);
}

// Get total balance across accounts
export function getTotalBalance(): number {
  return mockAccounts.reduce((sum, account) => sum + account.balance, 0);
}

// Get monthly spending
export function getMonthlySpending(): number {
  const currentMonth = '2026-05';
  return mockTransactions
    .filter(txn => txn.type === 'debit' && txn.date.startsWith(currentMonth))
    .reduce((sum, txn) => sum + txn.amount, 0);
}

// Get portfolio gains/losses
export function getPortfolioGainLoss(): { absolute: number; percentage: number } {
  const gainLoss = mockHoldings.reduce((sum, holding) => {
    const buyValue = holding.quantity * holding.buyPrice;
    const currentValue = holding.quantity * holding.currentPrice;
    return sum + (currentValue - buyValue);
  }, 0);

  const totalBuyValue = mockHoldings.reduce((sum, holding) => {
    return sum + holding.quantity * holding.buyPrice;
  }, 0);

  return {
    absolute: gainLoss,
    percentage: totalBuyValue > 0 ? (gainLoss / totalBuyValue) * 100 : 0,
  };
}
