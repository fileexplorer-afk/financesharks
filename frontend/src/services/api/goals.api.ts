import client from './client';

export interface GoalResponse {
  id: string;
  title: string;
  description: string | null;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  priority: string;
  category: string | null;
  monthlyContribution: number;
  progressPercent: number;
  monthsRemaining: number;
  createdAt: string;
}

export interface CreateGoalRequest {
  title: string;
  description?: string;
  targetAmount: number;
  currentAmount?: number;
  deadline: string;
  priority?: string;
  category?: string;
  monthlyContribution?: number;
}

export interface UpdateGoalRequest {
  title?: string;
  description?: string;
  targetAmount?: number;
  currentAmount?: number;
  deadline?: string;
  priority?: string;
  category?: string;
  monthlyContribution?: number;
}

export async function getGoals(): Promise<GoalResponse[]> {
  const res = await client.get('/goals');
  return res.data;
}

export async function getGoal(id: string): Promise<GoalResponse> {
  const res = await client.get(`/goals/${id}`);
  return res.data;
}

export async function createGoal(data: CreateGoalRequest): Promise<GoalResponse> {
  const res = await client.post('/goals', data);
  return res.data;
}

export async function updateGoal(id: string, data: UpdateGoalRequest): Promise<GoalResponse> {
  const res = await client.put(`/goals/${id}`, data);
  return res.data;
}

export async function deleteGoal(id: string): Promise<void> {
  await client.delete(`/goals/${id}`);
}

export async function contributeToGoal(id: string, amount: number): Promise<GoalResponse> {
  const res = await client.post(`/goals/${id}/contribute`, { amount });
  return res.data;
}
