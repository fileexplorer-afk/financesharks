import { motion } from 'framer-motion';
import { ArrowDownLeft, ArrowUpRight, BarChart3, Lightbulb } from 'lucide-react';
import { AppLayout } from '@/components/layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heading, Text, Muted, GradientText } from '@/components/ui/typography';
import { useUser, useFeatureGates } from '@/hooks';
import { mockAccounts, mockTransactions, mockGoals, getTotalBalance, getMonthlySpending, getPortfolioGainLoss } from '@/services/mockData';
import { generateMarketInsights, generateSmartSpendingTips } from '@/lib/aiSimulation';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function DashboardPage() {
  const { user } = useUser();
  const { hasFeature } = useFeatureGates();

  const totalBalance = getTotalBalance();
  const monthlySpending = getMonthlySpending();
  const { percentage: gainLossPercent } = getPortfolioGainLoss();

  const recentTransactions = mockTransactions.slice(0, 4);
  const insights = generateMarketInsights().slice(0, 2);
  const tips = generateSmartSpendingTips(monthlySpending, 75000).slice(0, 2);

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
        <motion.div
          variants={container}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {/* Total Balance */}
          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardDescription>Total Balance</CardDescription>
                <CardTitle className="text-3xl">₹{(totalBalance / 100000).toFixed(1)}L</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="success">+5.2% from last month</Badge>
              </CardContent>
            </Card>
          </motion.div>

          {/* Monthly Spending */}
          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardDescription>Monthly Spending</CardDescription>
                <CardTitle className="text-3xl">₹{(monthlySpending / 1000).toFixed(1)}K</CardTitle>
              </CardHeader>
              <CardContent>
                <Muted className="text-sm">Within budget</Muted>
              </CardContent>
            </Card>
          </motion.div>

          {/* Portfolio Gain */}
          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardDescription>Portfolio Gain</CardDescription>
                <CardTitle className="text-3xl text-[var(--color-success)]">{gainLossPercent.toFixed(1)}%</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="success">+₹28,500 YTD</Badge>
              </CardContent>
            </Card>
          </motion.div>

          {/* Active Goals */}
          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardDescription>Active Goals</CardDescription>
                <CardTitle className="text-3xl">{mockGoals.length}</CardTitle>
              </CardHeader>
              <CardContent>
                <Muted className="text-sm">2 on track, 1 needs boost</Muted>
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
                <motion.div variants={container} className="space-y-3">
                  {recentTransactions.map((txn) => (
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
                          <Text className="font-medium">{txn.description}</Text>
                          <Muted className="text-xs">{txn.date}</Muted>
                        </div>
                      </div>
                      <Text className={`font-semibold ${txn.type === 'credit' ? 'text-[var(--color-success)]' : 'text-[var(--text-primary)]'}`}>
                        {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toLocaleString()}
                      </Text>
                    </motion.div>
                  ))}
                </motion.div>
              </CardContent>
            </Card>

            {/* Accounts Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Your Accounts</CardTitle>
                <CardDescription>Linked accounts & balances</CardDescription>
              </CardHeader>
              <CardContent>
                <motion.div variants={container} className="space-y-3">
                  {mockAccounts.map((account) => (
                    <motion.div
                      key={account.id}
                      variants={item}
                      className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-secondary)]"
                    >
                      <div>
                        <Text className="font-medium">{account.name}</Text>
                        <Muted className="text-xs">{account.accountNumber}</Muted>
                      </div>
                      <Text className="font-semibold">₹{account.balance.toLocaleString()}</Text>
                    </motion.div>
                  ))}
                </motion.div>
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
                  <motion.div variants={container} className="space-y-3">
                    {insights.map((insight) => (
                      <motion.div
                        key={insight.id}
                        variants={item}
                        className="p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <Text className="font-medium text-sm">{insight.symbol}</Text>
                          <Badge variant={insight.recommendation === 'buy' ? 'success' : 'warning'}>
                            {insight.recommendation}
                          </Badge>
                        </div>
                        <Muted className="text-xs line-clamp-2">{insight.description}</Muted>
                        <div className="mt-2 pt-2 border-t border-[var(--border-color)]">
                          <GradientText className="text-xs">
                            {insight.changePercent > 0 ? '+' : ''}{insight.changePercent}%
                          </GradientText>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
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
                  <motion.div variants={container} className="space-y-3">
                    {tips.map((tip) => (
                      <motion.div
                        key={tip.id}
                        variants={item}
                        className="p-3 rounded-lg bg-[var(--bg-secondary)]"
                      >
                        <Text className="font-medium text-sm mb-1">{tip.title}</Text>
                        <Muted className="text-xs line-clamp-2">{tip.description}</Muted>
                        <GradientText className="text-xs mt-2">
                          Save ₹{tip.potentialSavings.toLocaleString()} monthly
                        </GradientText>
                      </motion.div>
                    ))}
                  </motion.div>
                </CardContent>
              </Card>
            )}

            {/* Goals Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Financial Goals</CardTitle>
                <CardDescription>{mockGoals.length} active</CardDescription>
              </CardHeader>
              <CardContent>
                <motion.div variants={container} className="space-y-4">
                  {mockGoals.slice(0, 2).map((goal) => {
                    const progress = (goal.currentAmount / goal.targetAmount) * 100;
                    return (
                      <motion.div key={goal.id} variants={item}>
                        <div className="flex items-center justify-between mb-1">
                          <Text className="font-medium text-sm">{goal.title}</Text>
                          <Muted className="text-xs">{Math.round(progress)}%</Muted>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[var(--bg-secondary)] overflow-hidden">
                          <motion.div
                            className="h-full bg-[var(--color-accent)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}
