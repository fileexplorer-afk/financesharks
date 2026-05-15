import client from './client';

export interface FamilyMemberResponse {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: string;
  status: string;
  createdAt: string;
}

export async function getFamilyMembers(): Promise<FamilyMemberResponse[]> {
  const res = await client.get('/family/members');
  return res.data;
}

export async function inviteMember(email: string): Promise<FamilyMemberResponse> {
  const res = await client.post('/family/invite', { email });
  return res.data;
}

export async function removeMember(id: string): Promise<void> {
  await client.delete(`/family/members/${id}`);
}

export async function updateMemberRole(id: string, role: string): Promise<FamilyMemberResponse> {
  const res = await client.put(`/family/members/${id}/role`, { role });
  return res.data;
}
