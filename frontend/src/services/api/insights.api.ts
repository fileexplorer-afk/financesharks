import client from './client';

export interface InsightResponse {
  title: string;
  description: string;
  type: string;
}

export async function getTips(): Promise<InsightResponse[]> {
  const res = await client.get('/insights/tips');
  return res.data;
}

export async function getMarketInsights(): Promise<InsightResponse[]> {
  const res = await client.get('/insights/market');
  return res.data;
}

export async function getPortfolioHealth(): Promise<string> {
  const res = await client.get('/insights/health');
  return res.data;
}
