import { motion } from "framer-motion";
import { useState } from "react";
import { Sprout, Rocket, Crown, Building, Landmark } from "lucide-react";
import { AppLayout } from "@/components/layout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heading, Text, Muted, GradientText } from "@/components/ui/typography";
import { PRICING_CONFIG } from "@/lib/constants";
import { getFeaturesByTier } from "@/lib/featureGates";
import type { Tier } from "@/types";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const tiers: Tier[] = ["free", "standard", "premium"];

const tierIcons: Record<Tier, React.ReactNode> = {
  free: <Sprout size={28} className="text-[var(--color-success)]" />,
  standard: <Rocket size={28} className="text-[var(--color-accent)]" />,
  premium: <Crown size={28} className="text-[var(--color-accent)]" />,
};

export function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <AppLayout activeKey="pricing">
      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="min-h-screen bg-[var(--bg-primary)] p-4 sm:p-6"
      >
        <motion.div variants={item} className="text-center mb-12">
          <Badge variant="violet" className="mb-4">Pricing</Badge>
          <Heading level={1} className="mb-3">Choose Your Plan</Heading>
          <Text className="text-[var(--text-secondary)] max-w-xl mx-auto mb-8">
            Unlock powerful financial tools. Upgrade your plan as your investment journey grows.
          </Text>

          <div className="flex items-center justify-center gap-4">
            <Muted className={`text-sm font-medium ${!annual ? "text-[var(--text-primary)]" : ""}`}>Monthly</Muted>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative w-14 h-7 rounded-full transition-colors ${annual ? "bg-[var(--color-accent)]" : "bg-[var(--bg-tertiary)]"}`}
            >
              <motion.div
                animate={{ x: annual ? 30 : 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-lg"
              />
            </button>
            <div className="flex items-center gap-2">
              <Muted className={`text-sm font-medium ${annual ? "text-[var(--text-primary)]" : ""}`}>Annual</Muted>
              <Badge variant="success" size="sm">Save 20%</Badge>
            </div>
          </div>
        </motion.div>

        <motion.div variants={container} className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
          {tiers.map((tier, i) => {
            const config = PRICING_CONFIG[tier];
            const features = getFeaturesByTier(tier);
            const isPremium = tier === "premium";
            const price = annual ? config.price * 10 : config.price;

            return (
              <motion.div
                key={tier}
                variants={item}
                whileHover={{ y: -6, scale: 1.015 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative"
              >
                {isPremium && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <Badge variant="violet" size="lg">Most Popular</Badge>
                  </div>
                )}

                <Card className="h-full flex flex-col transition-all duration-300 border border-[var(--border-color)] hover:ring-2 hover:ring-[var(--color-accent)]/30 hover:shadow-xl hover:shadow-[var(--color-accent)]/5">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      {tierIcons[tier]}
                    </div>
                    <CardTitle className="text-xl capitalize">{config.name}</CardTitle>
                    <CardDescription>{config.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-white">
                        {price === 0 ? "Free" : `₹${price}`}
                      </span>
                      {price > 0 && (
                        <Muted className="text-sm inline ml-1">/ {annual ? "yr" : "mo"}</Muted>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col">
                    <div className="flex-1 space-y-3 mb-8">
                      {features.map((feature) => (
                        <motion.div
                          key={feature}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + i * 0.1 }}
                          className="flex items-center gap-3"
                        >
                          <svg className="w-4 h-4 shrink-0 text-[var(--color-success)]" viewBox="0 0 16 16" fill="none">
                            <path d="M3 8.5l3.5 3.5L13 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <Muted className="text-sm capitalize">{feature.replace(/-/g, " ")}</Muted>
                        </motion.div>
                      ))}
                    </div>

                    <Button
                      variant={isPremium ? "gold" : tier === "standard" ? "primary" : "glass"}
                      className="w-full"
                      size="lg"
                    >
                      {tier === "free" ? "Get Started" : tier === "standard" ? "Upgrade to Standard" : "Go Premium"}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div variants={item} className="max-w-3xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Enterprise Plans</CardTitle>
              <CardDescription>Need more? We've got you covered.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-center">
                  <Building size={32} className="mx-auto mb-2 text-[var(--color-accent)]" />
                  <Heading level={4} className="mb-2">Family Plan</Heading>
                  <Muted className="text-sm mb-4">Up to 5 members with shared budgets</Muted>
                  <GradientText className="text-xl font-semibold">₹49.99/mo</GradientText>
                  <Button variant="glass" className="w-full mt-4">Learn More</Button>
                </div>
                <div className="p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-center">
                  <Landmark size={32} className="mx-auto mb-2 text-[var(--color-info)]" />
                  <Heading level={4} className="mb-2">Business Plan</Heading>
                  <Muted className="text-sm mb-4">Unlimited members with API access</Muted>
                  <GradientText className="text-xl font-semibold">₹99.99/mo</GradientText>
                  <Button variant="glass" className="w-full mt-4">Contact Sales</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item} className="max-w-3xl mx-auto mt-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { q: "Can I switch plans anytime?", a: "Yes, you can upgrade or downgrade at any time. Changes take effect next billing cycle." },
                { q: "Is my data secure?", a: "Absolutely. We use bank-grade encryption and never share your financial data with third parties." },
                { q: "What payment methods do you accept?", a: "We accept all major credit cards, UPI, and net banking." },
                { q: "Can I cancel my subscription?", a: "Yes, you can cancel anytime. Your data will remain accessible until the end of your billing period." },
              ].map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]"
                >
                  <Text className="font-medium mb-1">{faq.q}</Text>
                  <Muted className="text-sm">{faq.a}</Muted>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}
