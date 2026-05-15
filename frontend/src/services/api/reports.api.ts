import client from './client';

export interface NetWorth {
  totalBalance: number;
  portfolioValue: number;
  netWorth: number;
}

export interface SpendingByCategory {
  category: string;
  amount: number;
  percent: number;
}

export interface IncomeVsExpense {
  month: number;
  income: number;
  expense: number;
}

export async function getNetWorth(): Promise<NetWorth> {
  const res = await client.get('/reports/net-worth');
  return res.data;
}

export async function getSpendingByCategory(month?: number, year?: number): Promise<SpendingByCategory[]> {
  const res = await client.get('/reports/spending-by-category', { params: { month, year } });
  return res.data;
}

export async function getIncomeVsExpense(year: number): Promise<IncomeVsExpense[]> {
  const res = await client.get('/reports/income-vs-expense', { params: { year } });
  return res.data;
}
