import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, BarChart3 } from 'lucide-react';
import { AppLayout } from '@/components/layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heading, Text, Muted } from '@/components/ui/typography';
import { Skeleton } from '@/components/ui/skeleton';
import { useFeatureGates } from '@/hooks';
import * as insightsApi from '@/services/api/insights.api';
import * as portfolioApi from '@/services/api/holdings.api';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function InsightsPage() {
  const { hasFeature } = useFeatureGates();
  const [insights, setInsights] = useState<insightsApi.InsightResponse[]>([]);
  const [tips, setTips] = useState<insightsApi.InsightResponse[]>([]);
  const [health, setHealth] = useState('');
  const [summary, setSummary] = useState<portfolioApi.PortfolioSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (hasFeature('ai-insights')) {
      Promise.all([
        insightsApi.getMarketInsights(),
        insightsApi.getTips(),
        insightsApi.getPortfolioHealth(),
        portfolioApi.getPortfolioSummary().catch(() => null),
      ])
        .then(([i, t, h, s]) => { setInsights(i); setTips(t); setHealth(h); setSummary(s); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [hasFeature]);

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
          <motion.div variants={item} className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Market Insights</CardTitle>
                <CardDescription>AI-analyzed investment recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">{[1,2].map((i) => <Skeleton key={i} className="h-40 w-full" />)}</div>
                ) : (
                  <motion.div variants={container} className="space-y-4">
                    {insights.map((insight, i) => (
                      <motion.div key={i} variants={item} className="p-4 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <Text className="font-semibold text-lg">{insight.title}</Text>
                          </div>
                          <Badge variant={insight.type === 'success' ? 'success' : insight.type === 'warning' ? 'warning' : 'info'}>
                            {insight.type.toUpperCase()}
                          </Badge>
                        </div>
                        <Text className="text-sm text-[var(--text-secondary)] mb-3">{insight.description}</Text>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb size={18} className="text-[var(--color-accent)]" /> Smart Tips
                </CardTitle>
                <CardDescription>Save smarter</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">{[1,2,3].map((i) => <Skeleton key={i} className="h-24 w-full" />)}</div>
                ) : (
                  <motion.div variants={container} className="space-y-3">
                    {tips.slice(0, 3).map((tip, i) => (
                      <motion.div key={i} variants={item} className="p-3 rounded-lg bg-[var(--bg-secondary)]">
                        <Text className="font-medium text-sm mb-1">{tip.title}</Text>
                        <Muted className="text-xs line-clamp-2">{tip.description}</Muted>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 size={18} className="text-[var(--color-accent)]" /> Portfolio Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <Muted className="text-xs">Overall Performance</Muted>
                      <Text className={`font-semibold text-lg ${(summary?.totalGainLossPercent ?? 0) >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>
                        {(summary?.totalGainLossPercent ?? 0) >= 0 ? '+' : ''}{(summary?.totalGainLossPercent ?? 0).toFixed(2)}%
                      </Text>
                    </div>
                    <div className="p-3 rounded bg-[var(--bg-tertiary)]">
                      <Muted className="text-xs">Score</Muted>
                      <Text className="text-sm mt-1">{health || 'No portfolio data'}</Text>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}
