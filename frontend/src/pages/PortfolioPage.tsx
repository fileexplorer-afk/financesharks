import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Scale } from 'lucide-react';
import { AppLayout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heading, Text, Metric, Muted, GradientText } from '@/components/ui/typography';
import { Skeleton } from '@/components/ui/skeleton';
import * as holdingsApi from '@/services/api/holdings.api';
import * as insightsApi from '@/services/api/insights.api';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<holdingsApi.PortfolioSummary | null>(null);
  const [insights, setInsights] = useState<insightsApi.InsightResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      holdingsApi.getPortfolioSummary(),
      insightsApi.getMarketInsights(),
    ])
      .then(([p, i]) => { setPortfolio(p); setInsights(i); })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load portfolio'))
      .finally(() => setLoading(false));
  }, []);

  if (error) {
    return (
      <AppLayout activeKey="portfolio">
        <div className="min-h-screen bg-[var(--bg-primary)] p-4 sm:p-6 flex items-center justify-center">
          <div className="text-center">
            <Heading level={2} className="mb-2">Something went wrong</Heading>
            <Text className="text-[var(--text-secondary)] mb-4">{error}</Text>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout activeKey="portfolio">
      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="min-h-screen bg-[var(--bg-primary)] p-4 sm:p-6"
      >
        <motion.div variants={item} className="mb-8">
          <Heading level={1} className="mb-2">Investment Portfolio</Heading>
          <Text className="text-[var(--text-secondary)]">Manage your holdings and track performance.</Text>
        </motion.div>

        <motion.div variants={container} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardDescription>Total Portfolio Value</CardDescription>
                {loading ? <Skeleton className="h-9 w-24 mt-1" /> : <CardTitle className="text-3xl">₹{((portfolio?.totalValue ?? 0) / 100000).toFixed(2)}L</CardTitle>}
              </CardHeader>
              <CardContent>
                <Muted className="text-sm">Across {portfolio?.holdings.length ?? 0} holdings</Muted>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardDescription>Total Gain/Loss</CardDescription>
                {loading ? <Skeleton className="h-9 w-24 mt-1" /> : (
                  <CardTitle className={`text-3xl ${(portfolio?.totalGainLoss ?? 0) >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>
                    ₹{Math.abs(portfolio?.totalGainLoss ?? 0).toLocaleString()}
                  </CardTitle>
                )}
              </CardHeader>
              <CardContent>
                {loading ? <Skeleton className="h-5 w-16" /> : (
                  <Badge variant={(portfolio?.totalGainLossPercent ?? 0) >= 0 ? 'success' : 'danger'}>
                    {(portfolio?.totalGainLossPercent ?? 0) >= 0 ? '+' : ''}{(portfolio?.totalGainLossPercent ?? 0).toFixed(2)}%
                  </Badge>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardDescription>Holdings Count</CardDescription>
                {loading ? <Skeleton className="h-9 w-12 mt-1" /> : <CardTitle className="text-3xl">{portfolio?.holdings.length ?? 0}</CardTitle>}
              </CardHeader>
              <CardContent>
                <Muted className="text-sm">{portfolio?.sectorAllocation.length ?? 0} sectors</Muted>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div variants={container} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div variants={item} className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Your Holdings</CardTitle>
                <CardDescription>Current positions and performance</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[1,2,3,4].map((i) => <Skeleton key={i} className="h-40 w-full" />)}
                  </div>
                ) : (
                  <motion.div variants={container} className="space-y-4">
                    {(portfolio?.holdings ?? []).map((holding) => (
                      <motion.div
                        key={holding.id}
                        variants={item}
                        className="p-4 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <Text className="font-semibold">{holding.name}</Text>
                            <Muted className="text-sm">{holding.symbol} · {holding.quantity} units</Muted>
                          </div>
                          <Badge variant={holding.gainLossPercent >= 0 ? 'success' : 'danger'}>
                            {holding.gainLossPercent >= 0 ? '+' : ''}{holding.gainLossPercent.toFixed(2)}%
                          </Badge>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Muted className="text-xs">Buy Price</Muted>
                            <Text className="font-medium">₹{holding.buyPrice}</Text>
                          </div>
                          <div>
                            <Muted className="text-xs">Current Price</Muted>
                            <Text className="font-medium">₹{holding.currentPrice}</Text>
                          </div>
                          <div>
                            <Muted className="text-xs">Current Value</Muted>
                            <Metric>₹{holding.currentValue.toLocaleString()}</Metric>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-[var(--border-color)]">
                          <GradientText className="text-sm">
                            Gain/Loss: ₹{holding.gainLoss.toLocaleString()}
                          </GradientText>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp size={18} className="text-[var(--color-accent)]" /> Recommendations
                </CardTitle>
                <CardDescription>Market insights</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">{[1,2].map((i) => <Skeleton key={i} className="h-20 w-full" />)}</div>
                ) : (
                  <motion.div variants={container} className="space-y-3">
                    {insights.slice(0, 2).map((insight, i) => (
                      <motion.div key={i} variants={item} className="p-3 rounded-lg bg-[var(--bg-secondary)]">
                        <Text className="font-medium text-sm">{insight.title}</Text>
                        <Muted className="text-xs mt-1">{insight.description}</Muted>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale size={18} className="text-[var(--color-accent)]" /> Allocation
                </CardTitle>
                <CardDescription>Sector breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-2">{[1,2,3].map((i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
                ) : (
                  <motion.div variants={container} className="space-y-2">
                    {(portfolio?.sectorAllocation ?? []).map((sector) => (
                      <motion.div
                        key={sector.sector}
                        variants={item}
                        className="flex items-center justify-between p-2 rounded text-sm bg-[var(--bg-secondary)]"
                      >
                        <Text className="font-medium">{sector.sector}</Text>
                        <Muted className="text-xs">{sector.percent.toFixed(1)}%</Muted>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}
