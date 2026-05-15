import client from './client';

export interface AccountResponse {
  id: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
  createdAt: string;
  transactionCount: number;
}

export interface CreateAccountRequest {
  name: string;
  type: string;
  balance?: number;
  currency?: string;
}

export async function getAccounts(): Promise<AccountResponse[]> {
  const res = await client.get('/accounts');
  return res.data;
}

export async function getAccount(id: string): Promise<AccountResponse> {
  const res = await client.get(`/accounts/${id}`);
  return res.data;
}

export async function createAccount(data: CreateAccountRequest): Promise<AccountResponse> {
  const res = await client.post('/accounts', data);
  return res.data;
}

export async function updateAccount(id: string, data: { name: string; type: string }): Promise<AccountResponse> {
  const res = await client.put(`/accounts/${id}`, data);
  return res.data;
}

export async function deleteAccount(id: string): Promise<void> {
  await client.delete(`/accounts/${id}`);
}
