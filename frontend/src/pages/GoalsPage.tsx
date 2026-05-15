import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Target, Wallet, TrendingUp } from 'lucide-react';
import { AppLayout } from '@/components/layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heading, Text, Muted, Metric } from '@/components/ui/typography';
import { Skeleton } from '@/components/ui/skeleton';
import * as goalsApi from '@/services/api/goals.api';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function GoalsPage() {
  const [goals, setGoals] = useState<goalsApi.GoalResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    goalsApi.getGoals()
      .then(setGoals)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load goals'))
      .finally(() => setLoading(false));
  }, []);

  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);

  if (error) {
    return (
      <AppLayout activeKey="goals">
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
    <AppLayout activeKey="goals">
      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="min-h-screen bg-[var(--bg-primary)] p-4 sm:p-6"
      >
        <motion.div variants={item} className="mb-8">
          <Heading level={1} className="mb-2">Financial Goals</Heading>
          <Text className="text-[var(--text-secondary)]">Track progress and achieve your dreams.</Text>
        </motion.div>

        <motion.div variants={container} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardDescription>Total Goals</CardDescription>
                {loading ? <Skeleton className="h-9 w-12 mt-1" /> : <CardTitle className="text-3xl">{goals.length}</CardTitle>}
              </CardHeader>
              <CardContent>
                <Muted className="text-sm">{goals.length} active</Muted>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardDescription>Total Saved</CardDescription>
                {loading ? <Skeleton className="h-9 w-24 mt-1" /> : <CardTitle className="text-3xl">₹{totalSaved / 100000}L</CardTitle>}
              </CardHeader>
              <CardContent>
                <Muted className="text-sm">Towards your goals</Muted>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardDescription>Target Amount</CardDescription>
                {loading ? <Skeleton className="h-9 w-24 mt-1" /> : <CardTitle className="text-3xl">₹{totalTarget / 1000000}M</CardTitle>}
              </CardHeader>
              <CardContent>
                <Muted className="text-sm">Combined target</Muted>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div variants={container} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div variants={item} className="lg:col-span-2 space-y-4">
            {loading ? (
              [1,2,3].map((i) => (
                <div key={i} className="rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] overflow-hidden p-6">
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-64 mb-4" />
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    {[1,2,3,4].map((j) => <Skeleton key={j} className="h-12" />)}
                  </div>
                  <Skeleton className="h-3 w-full mb-4" />
                  <Skeleton className="h-16 w-full mb-4" />
                </div>
              ))
            ) : goals.map((goal) => (
              <motion.div
                key={goal.id}
                variants={item}
                className="rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <Text className="font-semibold text-lg">{goal.title}</Text>
                      <Muted className="text-sm">{goal.description}</Muted>
                    </div>
                    <Badge variant={goal.priority === 'high' ? 'danger' : goal.priority === 'medium' ? 'warning' : 'info'}>
                      {goal.priority} Priority
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                    <div>
                      <Muted className="text-xs">Saved</Muted>
                      <Metric className="text-2xl sm:text-4xl">₹{goal.currentAmount.toLocaleString()}</Metric>
                    </div>
                    <div>
                      <Muted className="text-xs">Target</Muted>
                      <Metric className="text-2xl sm:text-4xl">₹{goal.targetAmount.toLocaleString()}</Metric>
                    </div>
                    <div>
                      <Muted className="text-xs">Remaining</Muted>
                      <Metric className="text-2xl sm:text-4xl text-[var(--color-accent)]">
                        ₹{(goal.targetAmount - goal.currentAmount).toLocaleString()}
                      </Metric>
                    </div>
                    <div>
                      <Muted className="text-xs">Deadline</Muted>
                      <Text className="font-semibold text-sm">{goal.deadline.slice(5)}</Text>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <Muted className="text-xs">Progress</Muted>
                      <Text className="text-sm font-semibold">{Math.round(goal.progressPercent)}%</Text>
                    </div>
                    <div className="w-full h-3 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-hover)]"
                        initial={{ width: 0 }}
                        animate={{ width: `${goal.progressPercent}%` }}
                        transition={{ duration: 1, delay: 0.3 }}
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-[var(--bg-tertiary)] mb-4">
                    <Text className="font-medium text-sm mb-2">Goal Details</Text>
                    <Muted className="text-xs">
                      {goal.monthsRemaining > 0
                        ? `${goal.monthsRemaining} months remaining`
                        : 'Deadline passed'}
                      {goal.monthlyContribution > 0 && ` · ₹${goal.monthlyContribution.toLocaleString()}/month`}
                    </Muted>
                  </div>

                  <div className="flex items-center justify-between">
                    <Muted className="text-xs">{Math.round(goal.progressPercent)}% complete</Muted>
                    <Button variant="ghost" size="sm">Edit Goal</Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={item} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb size={18} className="text-[var(--color-accent)]" /> Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded bg-[var(--bg-tertiary)]">
                  <Text className="font-medium text-sm mb-1"><Target size={14} className="inline mr-1.5 text-[var(--color-accent)]" /> Goal Setting</Text>
                  <Muted className="text-xs">Use the SMART framework for achievable goals.</Muted>
                </div>
                <div className="p-3 rounded bg-[var(--bg-tertiary)]">
                  <Text className="font-medium text-sm mb-1"><Wallet size={14} className="inline mr-1.5 text-[var(--color-accent)]" /> Automate Savings</Text>
                  <Muted className="text-xs">Set up automatic transfers on payday.</Muted>
                </div>
                <div className="p-3 rounded bg-[var(--bg-tertiary)]">
                  <Text className="font-medium text-sm mb-1"><TrendingUp size={14} className="inline mr-1.5 text-[var(--color-accent)]" /> Track Progress</Text>
                  <Muted className="text-xs">Review monthly to stay motivated.</Muted>
                </div>
              </CardContent>
            </Card>

            <Button variant="gold" className="w-full">Add New Goal</Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}
