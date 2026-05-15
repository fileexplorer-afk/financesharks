import client from './client';
import type { AccountResponse } from './accounts.api';
import type { TransactionResponse } from './transactions.api';

export interface DashboardSummary {
  totalBalance: number;
  monthlySpending: number;
  monthlyIncome: number;
  activeGoals: number;
  portfolioValue: number;
  portfolioGainLoss: number;
  portfolioGainLossPercent: number;
  accounts: AccountResponse[];
  recentTransactions: TransactionResponse[];
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const res = await client.get('/dashboard/summary');
  return res.data;
}
