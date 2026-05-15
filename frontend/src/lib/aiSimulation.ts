import type { SpendingTip, MarketInsight } from '@/types';

/**
 * Generate smart spending tips based on user budget and spending patterns
 */
export function generateSmartSpendingTips(monthlySpending: number, monthlyIncome: number): SpendingTip[] {
  const tips: SpendingTip[] = [];
  const spendingRatio = monthlySpending / monthlyIncome;

  if (spendingRatio > 0.8) {
    tips.push({
      id: 'tip-1',
      title: 'Reduce food expenses',
      description: 'You\'re spending heavily on dining. Consider meal prep to save 15-20% monthly.',
      category: 'food',
      potentialSavings: monthlySpending * 0.18,
      priority: 'high',
      actionable: true,
    });
  }

  if (spendingRatio > 0.7) {
    tips.push({
      id: 'tip-2',
      title: 'Optimize transport costs',
      description: 'Monthly transport spending is high. Try carpooling or public transit.',
      category: 'transport',
      potentialSavings: monthlySpending * 0.15,
      priority: 'medium',
      actionable: true,
    });
  }

  tips.push({
    id: 'tip-3',
    title: 'Increase savings rate',
    description: `You could reach your emergency fund goal 6 months earlier by saving ₹${Math.round((monthlyIncome - monthlySpending) * 1.2 * 6)} monthly.`,
    category: 'savings',
    potentialSavings: Math.round((monthlyIncome - monthlySpending) * 1.2),
    priority: 'high',
    actionable: true,
  });

  return tips;
}

/**
 * Generate market-based investment recommendations
 */
export function generateMarketInsights(): MarketInsight[] {
  const insights: MarketInsight[] = [
    {
      id: 'insight-1',
      symbol: 'TCS',
      title: 'Tech Sector Momentum',
      description: 'TCS shows strong momentum with digital transformation demand. Target price ₹4200.',
      recommendation: 'buy',
      changePercent: 8.5,
      targetPrice: 4200,
      timestamp: new Date().toISOString(),
    },
    {
      id: 'insight-2',
      symbol: 'RELIANCE',
      title: 'Energy Sector Stability',
      description: 'RELIANCE maintaining steady growth with energy transition focus.',
      recommendation: 'hold',
      changePercent: 2.3,
      targetPrice: 3100,
      timestamp: new Date().toISOString(),
    },
    {
      id: 'insight-3',
      symbol: 'HDFC',
      title: 'Banking Sector Recovery',
      description: 'HDFC showing resilience with improved NPA ratios. Good time to accumulate.',
      recommendation: 'buy',
      changePercent: 5.2,
      targetPrice: 1850,
      timestamp: new Date().toISOString(),
    },
  ];

  return insights;
}

/**
 * Calculate goal achievement timeline
 */
export function calculateGoalTimeline(
  targetAmount: number,
  currentAmount: number,
  monthlyContribution: number
): { months: number; achievementDate: string } {
  const remaining = targetAmount - currentAmount;
  const months = Math.ceil(remaining / monthlyContribution);
  const achievementDate = new Date();
  achievementDate.setMonth(achievementDate.getMonth() + months);

  return {
    months,
    achievementDate: achievementDate.toISOString().split('T')[0],
  };
}

/**
 * Generate goal-specific recommendations
 */
export function generateGoalRecommendations(goalTitle: string): string[] {
  const recommendations: Record<string, string[]> = {
    'emergency-fund': [
      'Keep emergency fund in a high-yield savings account',
      'Avoid investing emergency fund in volatile assets',
      'Target 6 months of living expenses',
      'Set automatic transfers every payday',
    ],
    'house-down-payment': [
      'Consider home loan options from major banks',
      'Look for government schemes for first-time buyers',
      'Keep fund in relatively stable investments (debt, fixed deposits)',
      'Start house hunting when you\'ve accumulated 30% of target',
    ],
    'investment': [
      'Diversify across sectors (tech, finance, energy)',
      'Consider SIPs for consistent wealth building',
      'Rebalance quarterly based on market performance',
      'Maintain a 70:30 equity-to-debt ratio',
    ],
  };

  // Return matching recommendations or generic ones
  const key = goalTitle.toLowerCase().includes('emergency') ? 'emergency-fund'
    : goalTitle.toLowerCase().includes('house') ? 'house-down-payment'
      : 'investment';

  return recommendations[key] || recommendations.investment;
}

/**
 * Portfolio rebalancing suggestions
 */
export function getRebalancingSuggestions(allocation: Record<string, number>): { sector: string; action: string; reason: string }[] {
  const suggestions = [];

  const sectors = Object.entries(allocation);
  const avgAllocation = 100 / sectors.length;

  for (const [sector, current] of sectors) {
    if (current > avgAllocation * 1.3) {
      suggestions.push({
        sector,
        action: 'Reduce',
        reason: `${sector} allocation is ${Math.round(current)}%, consider rebalancing to ${Math.round(avgAllocation)}%`,
      });
    } else if (current < avgAllocation * 0.7) {
      suggestions.push({
        sector,
        action: 'Increase',
        reason: `${sector} allocation is ${Math.round(current)}%, consider increasing to ${Math.round(avgAllocation)}%`,
      });
    }
  }

  return suggestions;
}
