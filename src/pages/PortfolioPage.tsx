import { motion } from 'framer-motion';
import { TrendingUp, Scale } from 'lucide-react';
import { AppLayout } from '@/components/layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heading, Text, Metric, Muted, GradientText } from '@/components/ui/typography';
import { mockHoldings, getTotalPortfolioValue, getPortfolioGainLoss } from '@/services/mockData';
import { generateMarketInsights, getRebalancingSuggestions } from '@/lib/aiSimulation';

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

export function PortfolioPage() {
  const totalValue = getTotalPortfolioValue();
  const { absolute: gainLossAmount, percentage: gainLossPercent } = getPortfolioGainLoss();
  const insights = generateMarketInsights();
  const allocation = {
    'Stocks': (mockHoldings.filter(h => h.type === 'stock').length / mockHoldings.length) * 100,
    'Mutual Funds': (mockHoldings.filter(h => h.type === 'mutual-fund').length / mockHoldings.length) * 100,
  };
  const suggestions = getRebalancingSuggestions(allocation);

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

        {/* Portfolio Summary */}
        <motion.div variants={container} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardDescription>Total Portfolio Value</CardDescription>
                <CardTitle className="text-3xl">₹{(totalValue / 100000).toFixed(2)}L</CardTitle>
              </CardHeader>
              <CardContent>
                <Muted className="text-sm">Across {mockHoldings.length} holdings</Muted>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardDescription>Total Gain/Loss</CardDescription>
                <CardTitle className={`text-3xl ${gainLossAmount >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>
                  ₹{Math.abs(gainLossAmount).toLocaleString()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant={gainLossPercent >= 0 ? 'success' : 'danger'}>
                  {gainLossPercent >= 0 ? '+' : ''}{gainLossPercent.toFixed(2)}%
                </Badge>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardDescription>Holdings Count</CardDescription>
                <CardTitle className="text-3xl">{mockHoldings.length}</CardTitle>
              </CardHeader>
              <CardContent>
                <Muted className="text-sm">3 Stocks · 1 Mutual Fund</Muted>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div variants={container} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Holdings */}
          <motion.div variants={item} className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Your Holdings</CardTitle>
                <CardDescription>Current positions and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <motion.div variants={container} className="space-y-4">
                  {mockHoldings.map((holding) => {
                    const currentValue = holding.quantity * holding.currentPrice;
                    const buyValue = holding.quantity * holding.buyPrice;
                    const gainLoss = currentValue - buyValue;
                    const gainLossPercent = (gainLoss / buyValue) * 100;

                    return (
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
                          <Badge variant={gainLossPercent >= 0 ? 'success' : 'danger'}>
                            {gainLossPercent >= 0 ? '+' : ''}{gainLossPercent.toFixed(2)}%
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
                            <Metric>₹{currentValue.toLocaleString()}</Metric>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-[var(--border-color)]">
                          <GradientText className="text-sm">
                            Gain/Loss: ₹{gainLoss.toLocaleString()}
                          </GradientText>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recommendations */}
          <motion.div variants={item} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp size={18} className="text-[var(--color-accent)]" /> Recommendations
                </CardTitle>
                <CardDescription>Market insights</CardDescription>
              </CardHeader>
              <CardContent>
                <motion.div variants={container} className="space-y-3">
                  {insights.slice(0, 2).map((insight) => (
                    <motion.div
                      key={insight.id}
                      variants={item}
                      className="p-3 rounded-lg bg-[var(--bg-secondary)]"
                    >
                      <Text className="font-medium text-sm">{insight.title}</Text>
                      <Badge className="mt-2" variant={insight.recommendation === 'buy' ? 'success' : 'warning'}>
                        {insight.recommendation}
                      </Badge>
                    </motion.div>
                  ))}
                </motion.div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale size={18} className="text-[var(--color-accent)]" /> Rebalancing
                </CardTitle>
                <CardDescription>Suggested actions</CardDescription>
              </CardHeader>
              <CardContent>
                {suggestions.length > 0 ? (
                  <motion.div variants={container} className="space-y-2">
                    {suggestions.map((suggestion, idx) => (
                      <motion.div
                        key={idx}
                        variants={item}
                        className="p-2 rounded text-sm bg-[var(--bg-secondary)]"
                      >
                        <Text className="font-medium">{suggestion.action} {suggestion.sector}</Text>
                        <Muted className="text-xs mt-1">{suggestion.reason}</Muted>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <Muted className="text-sm">Your portfolio is well-balanced!</Muted>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}
