import client from './client';

export interface TransactionResponse {
  id: string;
  accountId: string | null;
  accountName: string | null;
  amount: number;
  category: string;
  description: string | null;
  type: string;
  date: string;
  createdAt: string;
}

export interface TransactionListResponse {
  items: TransactionResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateTransactionRequest {
  accountId?: string;
  amount: number;
  category: string;
  description?: string;
  type: 'credit' | 'debit';
  date: string;
}

export interface TransactionFilter {
  accountId?: string;
  category?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export async function getTransactions(filter?: TransactionFilter): Promise<TransactionListResponse> {
  const res = await client.get('/transactions', { params: filter });
  return res.data;
}

export async function getTransaction(id: string): Promise<TransactionResponse> {
  const res = await client.get(`/transactions/${id}`);
  return res.data;
}

export async function createTransaction(data: CreateTransactionRequest): Promise<TransactionResponse> {
  const res = await client.post('/transactions', data);
  return res.data;
}

export async function updateTransaction(id: string, data: CreateTransactionRequest): Promise<TransactionResponse> {
  const res = await client.put(`/transactions/${id}`, data);
  return res.data;
}

export async function deleteTransaction(id: string): Promise<void> {
  await client.delete(`/transactions/${id}`);
}

export async function getTransactionSummary(from?: string, to?: string): Promise<Record<string, number>> {
  const res = await client.get('/transactions/summary', { params: { from, to } });
  return res.data;
}
