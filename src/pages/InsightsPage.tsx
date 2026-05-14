import { motion } from 'framer-motion';
import { Lightbulb, BarChart3 } from 'lucide-react';
import { AppLayout } from '@/components/layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heading, Text, Muted } from '@/components/ui/typography';
import { useFeatureGates } from '@/hooks';
import { generateMarketInsights, generateSmartSpendingTips } from '@/lib/aiSimulation';
import { getMonthlySpending, getPortfolioGainLoss } from '@/services/mockData';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function InsightsPage() {
  const { hasFeature } = useFeatureGates();
  const insights = generateMarketInsights();
  const tips = generateSmartSpendingTips(getMonthlySpending(), 75000);
  const { percentage: gainLossPercent } = getPortfolioGainLoss();

  if (!hasFeature('ai-insights')) {
    return (
      <AppLayout activeKey="insights">
        <motion.div
          initial="hidden"
          animate="show"
          variants={container}
          className="min-h-screen bg-[var(--bg-primary)] p-6 flex items-center justify-center"
        >
          <div className="text-center">
            <Heading level={2} className="mb-4">Premium Feature</Heading>
            <Text className="text-[var(--text-secondary)] mb-6">
              Upgrade to Premium to access AI-powered insights.
            </Text>
          </div>
        </motion.div>
      </AppLayout>
    );
  }

  return (
    <AppLayout activeKey="insights">
      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="min-h-screen bg-[var(--bg-primary)] p-4 sm:p-6"
      >
        <motion.div variants={item} className="mb-8">
          <Heading level={1} className="mb-2">AI Insights</Heading>
          <Text className="text-[var(--text-secondary)]">Powered by advanced financial analysis.</Text>
        </motion.div>

        <motion.div variants={container} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Market Insights */}
          <motion.div variants={item} className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Market Insights</CardTitle>
                <CardDescription>AI-analyzed investment recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <motion.div variants={container} className="space-y-4">
                  {insights.map((insight) => (
                    <motion.div
                      key={insight.id}
                      variants={item}
                      className="p-4 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <Text className="font-semibold text-lg">{insight.symbol}</Text>
                          <Text className="mt-1">{insight.title}</Text>
                        </div>
                        <Badge variant={insight.recommendation === 'buy' ? 'success' : insight.recommendation === 'sell' ? 'danger' : 'warning'}>
                          {insight.recommendation.toUpperCase()}
                        </Badge>
                      </div>

                      <Text className="text-sm text-[var(--text-secondary)] mb-3">{insight.description}</Text>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Muted className="text-xs">Price Change</Muted>
                          <Text className={`font-semibold ${insight.changePercent >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>
                            {insight.changePercent >= 0 ? '+' : ''}{insight.changePercent}%
                          </Text>
                        </div>
                        <div>
                          <Muted className="text-xs">Target Price</Muted>
                          <Text className="font-semibold">₹{insight.targetPrice}</Text>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Smart Spending Tips */}
          <motion.div variants={item} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb size={18} className="text-[var(--color-accent)]" /> Smart Tips
                </CardTitle>
                <CardDescription>Save smarter</CardDescription>
              </CardHeader>
              <CardContent>
                <motion.div variants={container} className="space-y-3">
                  {tips.slice(0, 3).map((tip) => (
                    <motion.div
                      key={tip.id}
                      variants={item}
                      className="p-3 rounded-lg bg-[var(--bg-secondary)]"
                    >
                      <Text className="font-medium text-sm mb-1">{tip.title}</Text>
                      <Muted className="text-xs line-clamp-2">{tip.description}</Muted>
                      <div className="mt-2 pt-2 border-t border-[var(--border-color)]">
                        <Text className="text-xs font-semibold text-[var(--color-success)]">
                          Save ₹{tip.potentialSavings.toLocaleString()}/mo
                        </Text>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 size={18} className="text-[var(--color-accent)]" /> Portfolio Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <Muted className="text-xs">Overall Performance</Muted>
                    <Text className={`font-semibold text-lg ${gainLossPercent >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>
                      {gainLossPercent >= 0 ? '+' : ''}{gainLossPercent.toFixed(2)}%
                    </Text>
                  </div>
                  <div className="p-3 rounded bg-[var(--bg-tertiary)]">
                    <Muted className="text-xs">Recommendation</Muted>
                    <Text className="text-sm mt-1">
                      {gainLossPercent > 5 ? 'Excellent performance! Keep rebalancing.' : gainLossPercent > 0 ? 'Good progress, review quarterly.' : 'Review strategy and diversify.'}
                    </Text>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}
