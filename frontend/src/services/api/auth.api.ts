import client from './client';

export interface AuthResponse {
  userId: string;
  name: string;
  email: string;
  tier: string;
  avatarUrl: string | null;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  tier: string;
  avatarUrl: string | null;
  createdAt: string;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await client.post('/auth/login', { email, password });
  return res.data;
}

export async function register(name: string, email: string, password: string): Promise<AuthResponse> {
  const res = await client.post('/auth/register', { name, email, password });
  return res.data;
}

export async function refresh(refreshToken: string): Promise<AuthResponse> {
  const res = await client.post('/auth/refresh', { refreshToken });
  return res.data;
}

export async function logout(refreshToken: string): Promise<void> {
  await client.post('/auth/logout', { refreshToken });
}

export async function getMe(): Promise<UserResponse> {
  const res = await client.get('/auth/me');
  return res.data;
}
