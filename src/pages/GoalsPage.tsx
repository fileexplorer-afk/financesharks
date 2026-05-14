import { motion } from 'framer-motion';
import { Lightbulb, Target, Wallet, TrendingUp } from 'lucide-react';
import { AppLayout } from '@/components/layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heading, Text, Muted, Metric } from '@/components/ui/typography';
import { mockGoals } from '@/services/mockData';
import { calculateGoalTimeline, generateGoalRecommendations } from '@/lib/aiSimulation';

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

export function GoalsPage() {
  const monthlyContribution = 15000;

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

        {/* Goals Overview */}
        <motion.div variants={container} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardDescription>Total Goals</CardDescription>
                <CardTitle className="text-3xl">{mockGoals.length}</CardTitle>
              </CardHeader>
              <CardContent>
                <Muted className="text-sm">{mockGoals.length} active</Muted>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardDescription>Total Saved</CardDescription>
                <CardTitle className="text-3xl">₹{mockGoals.reduce((sum, g) => sum + g.currentAmount, 0) / 100000}L</CardTitle>
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
                <CardTitle className="text-3xl">₹{mockGoals.reduce((sum, g) => sum + g.targetAmount, 0) / 1000000}M</CardTitle>
              </CardHeader>
              <CardContent>
                <Muted className="text-sm">Combined target</Muted>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Goals List */}
        <motion.div variants={container} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div variants={item} className="lg:col-span-2 space-y-4">
            {mockGoals.map((goal) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              const timeline = calculateGoalTimeline(goal.targetAmount, goal.currentAmount, monthlyContribution);
              const recommendations = generateGoalRecommendations(goal.title);

              return (
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

                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div>
                        <Muted className="text-xs">Saved</Muted>
                        <Metric>₹{goal.currentAmount.toLocaleString()}</Metric>
                      </div>
                      <div>
                        <Muted className="text-xs">Target</Muted>
                        <Metric>₹{goal.targetAmount.toLocaleString()}</Metric>
                      </div>
                      <div>
                        <Muted className="text-xs">Remaining</Muted>
                        <Metric className="text-[var(--color-accent)]">
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
                        <Text className="text-sm font-semibold">{Math.round(progress)}%</Text>
                      </div>
                      <div className="w-full h-3 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-hover)]"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1, delay: 0.3 }}
                        />
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-[var(--bg-tertiary)] mb-4">
                      <Text className="font-medium text-sm mb-2">Personalized Recommendation</Text>
                      <Muted className="text-xs">{recommendations[0]}</Muted>
                    </div>

                    <div className="flex items-center justify-between">
                      <Muted className="text-xs">
                        On track for <span className="font-semibold">{timeline.months} months</span>
                      </Muted>
                      <Button variant="ghost" size="sm">Edit Goal</Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Tips Sidebar */}
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
