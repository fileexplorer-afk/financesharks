import client from './client';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  tier: string;
  role: string;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalAccounts: number;
  totalTransactions: number;
  totalGoals: number;
  activeUsersToday: number;
}

export async function getUsers(): Promise<AdminUser[]> {
  const res = await client.get('/admin/users');
  return res.data;
}

export async function getStats(): Promise<AdminStats> {
  const res = await client.get('/admin/stats');
  return res.data;
}

export async function updateUserRole(userId: string, role: string): Promise<AdminUser> {
  const res = await client.put(`/admin/users/${userId}/role`, { role });
  return res.data;
}

export async function deleteUser(userId: string): Promise<void> {
  await client.delete(`/admin/users/${userId}`);
}
