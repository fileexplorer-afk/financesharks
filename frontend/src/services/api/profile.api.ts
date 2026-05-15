import client from './client';

export interface ProfileResponse {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  tier: string;
  createdAt: string;
}

export async function getProfile(): Promise<ProfileResponse> {
  const res = await client.get('/profile');
  return res.data;
}

export async function updateProfile(data: { name?: string; email?: string }): Promise<ProfileResponse> {
  const res = await client.put('/profile', data);
  return res.data;
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await client.put('/profile/password', { currentPassword, newPassword });
}
