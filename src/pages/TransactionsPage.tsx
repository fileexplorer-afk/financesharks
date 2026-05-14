import { motion } from 'framer-motion';
import { useState } from 'react';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { AppLayout } from '@/components/layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heading, Text, Muted } from '@/components/ui/typography';
import { mockTransactions } from '@/services/mockData';
import { TRANSACTION_CATEGORIES } from '@/lib/constants';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export function TransactionsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredTransactions = selectedCategory
    ? mockTransactions.filter(t => t.category === selectedCategory)
    : mockTransactions;

  const categoryBreakdown = TRANSACTION_CATEGORIES.map(cat => ({
    category: cat,
    count: mockTransactions.filter(t => t.category === cat).length,
    total: mockTransactions
      .filter(t => t.category === cat && t.type === 'debit')
      .reduce((sum, t) => sum + t.amount, 0),
  }));

  return (
    <AppLayout activeKey="transactions">
      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="min-h-screen bg-[var(--bg-primary)] p-4 sm:p-6"
      >
        <motion.div variants={item} className="mb-8">
          <Heading level={1} className="mb-2">Transactions</Heading>
          <Text className="text-[var(--text-secondary)]">View and manage your transactions.</Text>
        </motion.div>

        <motion.div variants={container} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Transaction List */}
          <motion.div variants={item} className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>All your transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <motion.div variants={container} className="space-y-3">
                  {filteredTransactions.map((txn) => (
                    <motion.div
                      key={txn.id}
                      variants={item}
                      className="flex items-center justify-between p-4 rounded-lg bg-[var(--bg-secondary)] hover:border-[var(--border-color-hover)] border border-[var(--border-color)] transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center">
                          {txn.type === 'credit' ? <ArrowDownLeft size={18} className="text-[var(--color-success)]" /> : <ArrowUpRight size={18} className="text-[var(--color-danger)]" />}
                        </div>
                        <div className="flex-1">
                          <Text className="font-medium">{txn.description}</Text>
                          <Muted className="text-xs">{txn.date} · {txn.category}</Muted>
                        </div>
                      </div>
                      <div className="text-right">
                        <Text className={`font-semibold ${txn.type === 'credit' ? 'text-[var(--color-success)]' : ''}`}>
                          {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toLocaleString()}
                        </Text>
                        <Badge variant={txn.status === 'completed' ? 'success' : 'warning'} className="text-xs">
                          {txn.status}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Category Breakdown */}
          <motion.div variants={item} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>By Category</CardTitle>
                <CardDescription>Spending breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <motion.div variants={container} className="space-y-3">
                  {categoryBreakdown.map((cat) => (
                    <motion.button
                      key={cat.category}
                      variants={item}
                      onClick={() => setSelectedCategory(selectedCategory === cat.category ? null : cat.category)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedCategory === cat.category
                          ? 'bg-[var(--color-accent)] text-[var(--bg-primary)]'
                          : 'bg-[var(--bg-secondary)] hover:border-[var(--border-color-hover)]'
                      } border border-[var(--border-color)]`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <Text className="font-medium capitalize">{cat.category}</Text>
                          <Muted className="text-xs">{cat.count} transactions</Muted>
                        </div>
                        <Text className="font-semibold">₹{cat.total.toLocaleString()}</Text>
                      </div>
                    </motion.button>
                  ))}
                </motion.div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="glass" className="w-full" size="sm">Send Money</Button>
                <Button variant="outline" className="w-full" size="sm">Add Recurring</Button>
                <Button variant="ghost" className="w-full" size="sm">Export CSV</Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}
