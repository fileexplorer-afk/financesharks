import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownLeft, ArrowUpRight, BarChart3, Lightbulb } from 'lucide-react';
import { AppLayout } from '@/components/layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heading, Text, Muted, GradientText } from '@/components/ui/typography';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser, useFeatureGates } from '@/hooks';
import * as dashboardApi from '@/services/api/dashboard.api';
import * as goalsApi from '@/services/api/goals.api';
import * as insightsApi from '@/services/api/insights.api';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function DashboardPage() {
  const { user } = useUser();
  const { hasFeature } = useFeatureGates();
  const [data, setData] = useState<dashboardApi.DashboardSummary | null>(null);
  const [goals, setGoals] = useState<goalsApi.GoalResponse[]>([]);
  const [tips, setTips] = useState<insightsApi.InsightResponse[]>([]);
  const [insights, setInsights] = useState<insightsApi.InsightResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [summary, goalsData, tipsData, insightsData] = await Promise.all([
          dashboardApi.getDashboardSummary(),
          goalsApi.getGoals(),
          insightsApi.getTips(),
          insightsApi.getMarketInsights(),
        ]);
        setData(summary);
        setGoals(goalsData);
        setTips(tipsData);
        setInsights(insightsData);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (error) {
    return (
      <AppLayout activeKey="dashboard">
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
    <AppLayout activeKey="dashboard">
      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="min-h-screen bg-[var(--bg-primary)] p-4 sm:p-6"
      >
        {/* Header */}
        <motion.div variants={item} className="mb-8">
          <Heading level={1} className="mb-2">Welcome back, {user.name.split(' ')[0]}!</Heading>
          <Text className="text-[var(--text-secondary)]">Track your financial growth with real-time insights.</Text>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={container} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardDescription>Total Balance</CardDescription>
                {loading ? <Skeleton className="h-9 w-24 mt-1" /> : <CardTitle className="text-3xl">₹{((data?.totalBalance ?? 0) / 100000).toFixed(1)}L</CardTitle>}
              </CardHeader>
              <CardContent>
                <Badge variant="success">+5.2% from last month</Badge>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardDescription>Monthly Spending</CardDescription>
                {loading ? <Skeleton className="h-9 w-24 mt-1" /> : <CardTitle className="text-3xl">₹{((data?.monthlySpending ?? 0) / 1000).toFixed(1)}K</CardTitle>}
              </CardHeader>
              <CardContent>
                <Muted className="text-sm">Within budget</Muted>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardDescription>Portfolio Gain</CardDescription>
                {loading ? <Skeleton className="h-9 w-24 mt-1" /> : <CardTitle className={`text-3xl ${(data?.portfolioGainLossPercent ?? 0) >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>{data?.portfolioGainLossPercent.toFixed(1) ?? '0.0'}%</CardTitle>}
              </CardHeader>
              <CardContent>
                <Badge variant={(data?.portfolioGainLossPercent ?? 0) >= 0 ? 'success' : 'danger'}>{(data?.portfolioGainLoss ?? 0) >= 0 ? '+' : ''}₹{(data?.portfolioGainLoss ?? 0).toLocaleString()} YTD</Badge>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardDescription>Active Goals</CardDescription>
                {loading ? <Skeleton className="h-9 w-12 mt-1" /> : <CardTitle className="text-3xl">{data?.activeGoals ?? 0}</CardTitle>}
              </CardHeader>
              <CardContent>
                <Muted className="text-sm">Track your progress</Muted>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Main Content Grid */}
        <motion.div variants={container} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Transactions & Account Overview */}
          <motion.div variants={item} className="lg:col-span-2 space-y-6">
            {/* Recent Transactions */}
            <Card>
              <CardHeader className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Your latest activity</CardDescription>
                </div>
                <Button variant="ghost" size="sm">View All</Button>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {[1,2,3,4].map((i) => <Skeleton key={i} className="h-14 w-full" />)}
                  </div>
                ) : (
                  <motion.div variants={container} className="space-y-3">
                    {(data?.recentTransactions ?? []).map((txn) => (
                      <motion.div
                        key={txn.id}
                        variants={item}
                        className="flex items-center justify-between pb-3 border-b border-[var(--border-color)] last:border-0"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-10 h-10 rounded-lg bg-[var(--bg-secondary)] flex items-center justify-center">
                            {txn.type === 'credit' ? <ArrowDownLeft size={18} className="text-[var(--color-success)]" /> : <ArrowUpRight size={18} className="text-[var(--color-danger)]" />}
                          </div>
                          <div className="flex-1">
                            <Text className="font-medium">{txn.description || txn.category}</Text>
                            <Muted className="text-xs">{new Date(txn.date).toLocaleDateString()}</Muted>
                          </div>
                        </div>
                        <Text className={`font-semibold ${txn.type === 'credit' ? 'text-[var(--color-success)]' : 'text-[var(--text-primary)]'}`}>
                          {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toLocaleString()}
                        </Text>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </CardContent>
            </Card>

            {/* Accounts Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Your Accounts</CardTitle>
                <CardDescription>Linked accounts & balances</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {[1,2,3].map((i) => <Skeleton key={i} className="h-16 w-full" />)}
                  </div>
                ) : (
                  <motion.div variants={container} className="space-y-3">
                    {(data?.accounts ?? []).map((account) => (
                      <motion.div
                        key={account.id}
                        variants={item}
                        className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-secondary)]"
                      >
                        <div>
                          <Text className="font-medium">{account.name}</Text>
                          <Muted className="text-xs">{account.type} • {account.currency}</Muted>
                        </div>
                        <Text className="font-semibold">₹{account.balance.toLocaleString()}</Text>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div variants={item} className="space-y-6">
            {/* Market Insights */}
            {hasFeature('ai-insights') && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 size={18} className="text-[var(--color-accent)]" /> Market Insights
                  </CardTitle>
                  <CardDescription>AI-powered recommendations</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-3">
                      {[1,2].map((i) => <Skeleton key={i} className="h-28 w-full" />)}
                    </div>
                  ) : (
                    <motion.div variants={container} className="space-y-3">
                      {insights.map((insight, i) => (
                        <motion.div
                          key={i}
                          variants={item}
                          className="p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <Text className="font-medium text-sm">{insight.title}</Text>
                            <Badge variant={insight.type === 'success' ? 'success' : insight.type === 'warning' ? 'warning' : 'info'}>{insight.type}</Badge>
                          </div>
                          <Muted className="text-xs line-clamp-2">{insight.description}</Muted>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Smart Spending Tips */}
            {hasFeature('smart-spending') && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb size={18} className="text-[var(--color-accent)]" /> Smart Tips
                  </CardTitle>
                  <CardDescription>Save more wisely</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-3">
                      {[1,2].map((i) => <Skeleton key={i} className="h-28 w-full" />)}
                    </div>
                  ) : (
                    <motion.div variants={container} className="space-y-3">
                      {tips.map((tip, i) => (
                        <motion.div key={i} variants={item} className="p-3 rounded-lg bg-[var(--bg-secondary)]">
                          <Text className="font-medium text-sm mb-1">{tip.title}</Text>
                          <Muted className="text-xs line-clamp-2">{tip.description}</Muted>
                          <GradientText className="text-xs mt-2">
                            {tip.type === 'success' ? '✓ ' : ''}Tip
                          </GradientText>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Goals Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Financial Goals</CardTitle>
                <CardDescription>{goals.length} active</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[1,2].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
                  </div>
                ) : (
                  <motion.div variants={container} className="space-y-4">
                    {goals.slice(0, 2).map((goal) => (
                      <motion.div key={goal.id} variants={item}>
                        <div className="flex items-center justify-between mb-1">
                          <Text className="font-medium text-sm">{goal.title}</Text>
                          <Muted className="text-xs">{Math.round(goal.progressPercent)}%</Muted>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[var(--bg-secondary)] overflow-hidden">
                          <motion.div
                            className="h-full bg-[var(--color-accent)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${goal.progressPercent}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                          />
                        </div>
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
