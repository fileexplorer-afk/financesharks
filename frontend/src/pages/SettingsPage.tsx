import { motion } from "framer-motion";
import { useState } from "react";
import { User, Palette, Lock, Bell, CreditCard, Smartphone, ShieldCheck } from "lucide-react";
import { AppLayout } from "@/components/layout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Heading, Text, Muted } from "@/components/ui/typography";
import { Input, InputGroup, InputLabel } from "@/components/ui/input";
import { useUser, useTheme } from "@/hooks";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.35 } },
};

export function SettingsPage() {
  const { user } = useUser();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <AppLayout activeKey="settings">
      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="min-h-screen bg-[var(--bg-primary)] p-4 sm:p-6"
      >
        <motion.div variants={item} className="mb-8">
          <Heading level={1} className="mb-2">Settings</Heading>
          <Text className="text-[var(--text-secondary)]">Manage your account preferences and configurations.</Text>
        </motion.div>

        <motion.div variants={container} className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <motion.div variants={item} className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <Avatar fallback={user.name.split(" ").map(n => n[0]).join("")} size="xl" status="online" />
                  <Heading level={4} className="mt-4">{user.name}</Heading>
                  <Muted className="text-sm">{user.email}</Muted>
                  <Badge variant="violet" className="mt-2 capitalize">{user.tier}</Badge>
                </div>

                <div className="space-y-1" role="tablist" aria-label="Settings tabs">
                  {[
                    { key: "profile", label: "Profile", icon: <User size={16} /> },
                    { key: "preferences", label: "Preferences", icon: <Palette size={16} /> },
                    { key: "security", label: "Security", icon: <Lock size={16} /> },
                    { key: "notifications", label: "Notifications", icon: <Bell size={16} /> },
                    { key: "billing", label: "Billing", icon: <CreditCard size={16} /> },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      role="tab"
                      aria-selected={activeTab === tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all inline-flex items-center gap-3 ${
                        activeTab === tab.key
                          ? "bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20"
                          : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] border border-transparent"
                      }`}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item} className="lg:col-span-3 space-y-6">
            {activeTab === "profile" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <InputGroup>
                        <InputLabel>Full Name</InputLabel>
                        <Input defaultValue={user.name} placeholder="Your name" />
                      </InputGroup>
                      <InputGroup>
                        <InputLabel>Email Address</InputLabel>
                        <Input type="email" defaultValue={user.email} placeholder="your@email.com" />
                      </InputGroup>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <InputGroup>
                        <InputLabel>Phone Number</InputLabel>
                        <Input defaultValue="+91 98765 43210" placeholder="Phone number" />
                      </InputGroup>
                      <InputGroup>
                        <InputLabel>Date of Birth</InputLabel>
                        <Input defaultValue="1992-04-15" type="date" />
                      </InputGroup>
                    </div>
                    <InputGroup>
                      <InputLabel>Address</InputLabel>
                      <Input defaultValue="42, Finance Street, Mumbai - 400001" placeholder="Your address" />
                    </InputGroup>
                    <div className="flex gap-3 pt-2">
                      <Button variant="primary">Save Changes</Button>
                      <Button variant="ghost">Cancel</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "preferences" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>Customise your experience</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                      <div>
                        <Text className="font-medium">Dark Mode</Text>
                        <Muted className="text-sm">Toggle between dark and light themes</Muted>
                      </div>
                      <button
                        onClick={toggleTheme}
                        role="switch"
                        aria-checked={theme === "dark"}
                        aria-label="Toggle dark mode"
                        className={`relative w-12 h-6 rounded-full transition-colors ${theme === "dark" ? "bg-[var(--color-accent)]" : "bg-[var(--bg-tertiary)]"}`}
                      >
                        <motion.div
                          animate={{ x: theme === "dark" ? 24 : 2 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-lg"
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                      <div>
                        <Text className="font-medium">Compact View</Text>
                        <Muted className="text-sm">Show more content per page</Muted>
                      </div>
                      <div className="w-12 h-6 rounded-full bg-[var(--bg-tertiary)]" />
                    </div>

                    <div className="space-y-3">
                      <InputGroup>
                        <InputLabel>Currency Preference</InputLabel>
                        <Input defaultValue="INR - Indian Rupee (₹)" />
                      </InputGroup>
                      <InputGroup>
                        <InputLabel>Language</InputLabel>
                        <Input defaultValue="English (US)" />
                      </InputGroup>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "security" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Password</CardTitle>
                    <CardDescription>Update your password regularly</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <InputGroup>
                      <InputLabel>Current Password</InputLabel>
                      <Input type="password" placeholder="Enter current password" />
                    </InputGroup>
                    <InputGroup>
                      <InputLabel>New Password</InputLabel>
                      <Input type="password" placeholder="Enter new password" />
                    </InputGroup>
                    <InputGroup>
                      <InputLabel>Confirm Password</InputLabel>
                      <Input type="password" placeholder="Confirm new password" />
                    </InputGroup>
                    <Button variant="primary">Update Password</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShieldCheck size={18} className="text-[var(--color-accent)]" /> Two-Factor Authentication
                    </CardTitle>
                    <CardDescription>Add an extra layer of security</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                      <div>
                        <Text className="font-medium">2FA via Authenticator App</Text>
                        <Muted className="text-sm">Use Google Authenticator or Authy</Muted>
                      </div>
                      <Button variant="outline" size="sm">Enable</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "notifications" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Control what alerts you receive</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { title: "Transaction Alerts", desc: "Get notified for every transaction" },
                      { title: "Bill Reminders", desc: "Reminders before bills are due" },
                      { title: "Goal Milestones", desc: "Celebrate when you hit a savings goal" },
                      { title: "Market Updates", desc: "Daily market summary and insights" },
                      { title: "Budget Warnings", desc: "Alert when nearing budget limits" },
                    ].map((n, i) => {
                      const on = i < 3;
                      return (
                        <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                          <div>
                            <Text className="font-medium">{n.title}</Text>
                            <Muted className="text-sm">{n.desc}</Muted>
                          </div>
                          <button
                            role="switch"
                            aria-checked={on}
                            aria-label={`Toggle ${n.title}`}
                            className={`relative w-12 h-6 rounded-full transition-colors shrink-0 ${on ? "bg-[var(--color-accent)]" : "bg-[var(--bg-tertiary)]"}`}
                          >
                            <motion.div
                              animate={{ x: on ? 24 : 2 }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                              className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-lg"
                            />
                          </button>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "billing" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Current Plan</CardTitle>
                    <CardDescription>You are on the {user.tier} plan</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-[var(--color-accent)]/10 to-[var(--color-accent)]/5 border border-[var(--color-accent)]/20 text-center">
                      {user.tier === "premium" ? (
                        <>
                          <Muted className="text-sm mb-1">Premium Plan</Muted>
                          <Heading level={2} className="text-4xl mb-1">₹29.99</Heading>
                          <Muted className="text-sm">per month · billed monthly</Muted>
                          <div className="flex gap-3 justify-center mt-6">
                            <Button variant="glass">Manage Plan</Button>
                            <Button variant="ghost">Cancel Subscription</Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <Muted className="text-sm mb-1 capitalize">{user.tier === "free" ? "Free" : "Standard"} Plan</Muted>
                          <Heading level={2} className="text-4xl mb-1">{user.tier === "free" ? "₹0" : "₹9.99"}</Heading>
                          <Muted className="text-sm">per month · {user.tier === "free" ? "basic features" : "enhanced features"}</Muted>
                          <div className="flex gap-3 justify-center mt-6">
                            <Button variant="gold">Upgrade Plan</Button>
                            <Button variant="ghost">Compare Plans</Button>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>Manage your payment options</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { type: "Visa", last4: "4242", expiry: "05/28" },
                      { type: "UPI", last4: "raghav@paytm", expiry: "Primary" },
                    ].map((method, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-info)]/20 to-[var(--color-info)]/5 flex items-center justify-center text-[var(--color-info)]">
                            {i === 0 ? <CreditCard size={18} /> : <Smartphone size={18} />}
                          </div>
                          <div>
                            <Text className="font-medium">{method.type} •••• {method.last4}</Text>
                            <Muted className="text-xs">Expires {method.expiry}</Muted>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </div>
                    ))}
                    <Button variant="glass" className="w-full">Add Payment Method</Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}
