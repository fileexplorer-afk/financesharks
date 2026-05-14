import { motion } from "framer-motion";
import { BarChart3, Building, TrendingUp, CreditCard } from "lucide-react";
import { AppLayout } from "@/components/layout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heading, Text, Muted, Metric } from "@/components/ui/typography";
import { mockTransactions, mockAccounts, getTotalBalance, getMonthlySpending } from "@/services/mockData";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const barHeights = [65, 45, 80, 55, 90, 70, 50, 85, 60, 75, 95, 70];

export function ReportsPage() {
  const totalBalance = getTotalBalance();
  const monthlySpending = getMonthlySpending();
  const incomeTotal = mockTransactions.filter(t => t.type === "credit").reduce((s, t) => s + t.amount, 0);

  const categoryData = [
    { label: "Food", amount: 3500, color: "from-[var(--color-success)]/40 to-[var(--color-success)]/10" },
    { label: "Transport", amount: 1200, color: "from-[var(--color-info)]/40 to-[var(--color-info)]/10" },
    { label: "Shopping", amount: 2500, color: "from-[var(--color-violet)]/40 to-[var(--color-violet)]/10" },
    { label: "Utilities", amount: 1500, color: "from-[var(--color-accent)]/40 to-[var(--color-accent)]/10" },
    { label: "Entertainment", amount: 800, color: "from-[var(--color-danger)]/40 to-[var(--color-danger)]/10" },
  ];

  const maxCategory = Math.max(...categoryData.map(c => c.amount));

  return (
    <AppLayout activeKey="reports">
      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="min-h-screen bg-[var(--bg-primary)] p-4 sm:p-6"
      >
        <motion.div variants={item} className="mb-8">
          <Heading level={1} className="mb-2">Reports & Analytics</Heading>
          <Text className="text-[var(--text-secondary)]">Visualise your financial performance with detailed reports.</Text>
        </motion.div>

        <motion.div variants={container} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardDescription>Net Worth</CardDescription>
                <CardTitle className="text-3xl">₹{(totalBalance / 100000).toFixed(2)}L</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="success">+12.3% vs last month</Badge>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardDescription>Monthly Income</CardDescription>
                <CardTitle className="text-3xl">₹{(incomeTotal / 1000).toFixed(1)}K</CardTitle>
              </CardHeader>
              <CardContent>
                <Muted className="text-sm">Stable income stream</Muted>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardDescription>Monthly Spending</CardDescription>
                <CardTitle className="text-3xl">₹{(monthlySpending / 1000).toFixed(1)}K</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="success">Within budget</Badge>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardDescription>Savings Rate</CardDescription>
                <CardTitle className="text-3xl">68%</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="info">Excellent</Badge>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div variants={container} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div variants={item} className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Spending Trend</CardTitle>
                <CardDescription>Monthly expenditure over the last 12 months</CardDescription>
              </CardHeader>
              <CardContent>
                  <div className="flex items-end justify-between gap-2 h-48 pt-4" role="img" aria-label="Monthly spending trend chart">
                  {barHeights.map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 0.6, delay: i * 0.05, ease: "easeOut" }}
                      className="flex-1 rounded-t-lg bg-gradient-to-t from-[var(--color-accent)]/40 to-[var(--color-accent)]/10 relative group cursor-pointer"
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-2 py-1 text-xs whitespace-nowrap">
                        ₹{(h * 120).toLocaleString()}
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="flex justify-between mt-3">
                  {monthLabels.map((m, i) => (
                    <Muted key={i} className="text-[10px] font-medium">{m}</Muted>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Summary</CardTitle>
                <CardDescription>All linked accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <motion.div variants={container} className="space-y-3">
                  {mockAccounts.map((account) => (
                    <motion.div
                      key={account.id}
                      variants={item}
                      className="flex items-center justify-between p-4 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-accent)]/20 to-[var(--color-accent)]/5 flex items-center justify-center text-[var(--color-accent)]">
                          {account.type === "savings" ? <Building size={18} /> : account.type === "investment" ? <TrendingUp size={18} /> : <CreditCard size={18} />}
                        </div>
                        <div>
                          <Text className="font-medium">{account.name}</Text>
                          <Muted className="text-xs">{account.accountNumber}</Muted>
                        </div>
                      </div>
                      <div className="text-right">
                        <Metric className="text-base">₹{account.balance.toLocaleString()}</Metric>
                        <Muted className="text-xs">{account.currency}</Muted>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 size={18} className="text-[var(--color-accent)]" /> Category Breakdown
                </CardTitle>
                <CardDescription>Where your money goes</CardDescription>
              </CardHeader>
              <CardContent>
                <motion.div variants={container} className="space-y-4">
                  {categoryData.map((cat, i) => (
                    <motion.div key={cat.label} variants={item}>
                      <div className="flex items-center justify-between mb-1">
                        <Text className="text-sm font-medium">{cat.label}</Text>
                        <Muted className="text-xs">₹{cat.amount.toLocaleString()}</Muted>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(cat.amount / maxCategory) * 100}%` }}
                          transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                          className={`h-full rounded-full bg-gradient-to-r ${cat.color}`}
                        />
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Export Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="glass" className="w-full justify-between">
                  <span>Download PDF</span>
                  <span className="opacity-50">→</span>
                </Button>
                <Button variant="glass" className="w-full justify-between">
                  <span>Export as CSV</span>
                  <span className="opacity-50">→</span>
                </Button>
                <Button variant="glass" className="w-full justify-between">
                  <span>Print Report</span>
                  <span className="opacity-50">→</span>
                </Button>
                <Button variant="outline" className="w-full">
                  Schedule Monthly Report
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}
