import client from './client';

export interface HoldingResponse {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
  currentValue: number;
  investedValue: number;
  gainLoss: number;
  gainLossPercent: number;
  sector: string | null;
  type: string;
}

export interface PortfolioSummary {
  totalValue: number;
  totalInvested: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  sectorAllocation: { sector: string; value: number; percent: number }[];
  holdings: HoldingResponse[];
}

export async function getHoldings(): Promise<HoldingResponse[]> {
  const res = await client.get('/holdings');
  return res.data;
}

export async function getHolding(id: string): Promise<HoldingResponse> {
  const res = await client.get(`/holdings/${id}`);
  return res.data;
}

export async function createHolding(data: {
  symbol: string;
  name: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
  sector?: string;
  type?: string;
}): Promise<HoldingResponse> {
  const res = await client.post('/holdings', data);
  return res.data;
}

export async function updateHolding(id: string, data: { quantity: number; currentPrice: number }): Promise<HoldingResponse> {
  const res = await client.put(`/holdings/${id}`, data);
  return res.data;
}

export async function deleteHolding(id: string): Promise<void> {
  await client.delete(`/holdings/${id}`);
}

export async function getPortfolioSummary(): Promise<PortfolioSummary> {
  const res = await client.get('/portfolio/summary');
  return res.data;
}
