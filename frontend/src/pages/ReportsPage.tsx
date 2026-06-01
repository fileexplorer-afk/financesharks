import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart3, Building, TrendingUp, CreditCard } from "lucide-react";
import { AppLayout } from "@/components/layout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heading, Text, Muted, Metric } from "@/components/ui/typography";
import { Skeleton } from "@/components/ui/skeleton";
import * as reportsApi from "@/services/api/reports.api";
import * as dashboardApi from "@/services/api/dashboard.api";
import type { AccountResponse } from "@/services/api/accounts.api";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function ReportsPage() {
  const [netWorth, setNetWorth] = useState<reportsApi.NetWorth | null>(null);
  const [categories, setCategories] = useState<reportsApi.SpendingByCategory[]>([]);
  const [incomeExpense, setIncomeExpense] = useState<reportsApi.IncomeVsExpense[]>([]);
  const [accounts, setAccounts] = useState<AccountResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      reportsApi.getNetWorth(),
      reportsApi.getSpendingByCategory(),
      reportsApi.getIncomeVsExpense(new Date().getFullYear()),
      dashboardApi.getDashboardSummary(),
    ])
      .then(([nw, cat, ie, dash]) => {
        setNetWorth(nw);
        setCategories(cat);
        setIncomeExpense(ie);
        setAccounts(dash.accounts);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load reports'))
      .finally(() => setLoading(false));
  }, []);

  const maxCategory = categories.length > 0 ? Math.max(...categories.map(c => c.amount)) : 1;
  const curMonth = new Date().getMonth();
  const spending = incomeExpense[curMonth]?.expense ?? 0;
  const income = incomeExpense[curMonth]?.income ?? 0;
  const savingsRate = income > 0 ? Math.round((income - spending) / income * 100) : 0;

  if (error) {
    return (
      <AppLayout activeKey="reports">
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
                {loading ? <Skeleton className="h-9 w-24 mt-1" /> : <CardTitle className="text-3xl">₹{((netWorth?.netWorth ?? 0) / 100000).toFixed(2)}L</CardTitle>}
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
                {loading ? <Skeleton className="h-9 w-24 mt-1" /> : <CardTitle className="text-3xl">₹{(income / 1000).toFixed(1)}K</CardTitle>}
              </CardHeader>
              <CardContent>
                <Muted className="text-sm">Current month</Muted>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardDescription>Monthly Spending</CardDescription>
                {loading ? <Skeleton className="h-9 w-24 mt-1" /> : <CardTitle className="text-3xl">₹{(spending / 1000).toFixed(1)}K</CardTitle>}
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
                {loading ? <Skeleton className="h-9 w-16 mt-1" /> : <CardTitle className="text-3xl">{savingsRate}%</CardTitle>}
              </CardHeader>
              <CardContent>
                <Badge variant={savingsRate >= 50 ? 'info' : 'warning'}>{savingsRate >= 50 ? 'Excellent' : 'Needs Improvement'}</Badge>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div variants={container} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div variants={item} className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Income vs Expense</CardTitle>
                <CardDescription>Monthly comparison over the last 12 months</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-48 w-full" />
                ) : (
                  <div className="flex items-end justify-between gap-2 h-48 pt-4" role="img" aria-label="Income vs expense chart">
                    {incomeExpense.map((m, i) => {
                      const maxVal = Math.max(...incomeExpense.map(x => Math.max(x.income, x.expense)), 1);
                      const incomeH = (m.income / maxVal) * 100;
                      const expenseH = (m.expense / maxVal) * 100;
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${incomeH}%` }}
                            transition={{ duration: 0.5, delay: i * 0.05 }}
                            className="w-full rounded-t-lg bg-gradient-to-t from-[var(--color-success)]/60 to-[var(--color-success)]/20 relative group cursor-pointer"
                            title={`Income: ₹${m.income.toLocaleString()}`}
                          />
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${expenseH}%` }}
                            transition={{ duration: 0.5, delay: i * 0.05 + 0.1 }}
                            className="w-full rounded-t-lg bg-gradient-to-t from-[var(--color-accent)]/60 to-[var(--color-accent)]/20 relative group cursor-pointer"
                            title={`Expense: ₹${m.expense.toLocaleString()}`}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
                <div className="flex justify-between mt-3">
                  {monthLabels.map((m, i) => (
                    <Muted key={i} className="text-[10px] font-medium">{m}</Muted>
                  ))}
                </div>
                <div className="flex gap-4 mt-3 pt-3 border-t border-[var(--border-color)]">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-[var(--color-success)]/60" />
                    <Muted className="text-xs">Income</Muted>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-[var(--color-accent)]/60" />
                    <Muted className="text-xs">Expense</Muted>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Summary</CardTitle>
                <CardDescription>All linked accounts</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">{[1,2,3].map((i) => <Skeleton key={i} className="h-20 w-full" />)}</div>
                ) : (
                  <motion.div variants={container} className="space-y-3">
                    {accounts.map((account) => (
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
                            <Muted className="text-xs">{account.type} · {account.currency}</Muted>
                          </div>
                        </div>
                        <div className="text-right">
                          <Metric className="text-base">₹{account.balance.toLocaleString()}</Metric>
                          <Muted className="text-xs">{account.currency}</Muted>
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
                  <BarChart3 size={18} className="text-[var(--color-accent)]" /> Category Breakdown
                </CardTitle>
                <CardDescription>Where your money goes</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">{[1,2,3,4].map((i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
                ) : categories.length === 0 ? (
                  <Muted>No spending data this month</Muted>
                ) : (
                  <motion.div variants={container} className="space-y-4">
                    {categories.map((cat, i) => (
                      <motion.div key={cat.category} variants={item}>
                        <div className="flex items-center justify-between mb-1">
                          <Text className="text-sm font-medium capitalize">{cat.category}</Text>
                          <Muted className="text-xs">₹{cat.amount.toLocaleString()}</Muted>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(cat.amount / maxCategory) * 100}%` }}
                            transition={{ duration: 0.8, delay: i * 0.1 }}
                            className="h-full rounded-full bg-gradient-to-r from-[var(--color-accent)]/60 to-[var(--color-accent)]/20"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
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
