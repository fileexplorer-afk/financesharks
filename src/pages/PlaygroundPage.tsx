import { useState } from "react";
import { Sparkles, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import {
  InputGroup,
  InputLabel,
  InputDescription,
  Input,
} from "@/components/ui/input";

import {
  Heading,
  Text,
  Muted,
  Metric,
  GradientText,
} from "@/components/ui/typography";

import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

// ── Existing components ─────────────────────────────────────────
import { Dropdown } from "@/components/ui/dropdown";
import type { DropdownOption } from "@/components/ui/dropdown";
import { Modal } from "@/components/ui/modal";
import { Tabs, TabList, Tab, TabPanel, TabPanels } from "@/components/ui/tabs";
import { Tooltip } from "@/components/ui/tooltips";

// ── Navigation components ───────────────────────────────────────
import { Navbar }      from "@/components/navigation/navbar";
import { Sidebar }     from "@/components/navigation/sidebar";
import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import type { NavItem, NavbarAction, SidebarGroup } from "@/components/navigation";

// ── Icons (inline SVGs so there's no extra dep) ─────────────────
const IconWallet = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="1" y="3" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.3" />
    <path d="M1 6h12" stroke="currentColor" strokeWidth="1.3" />
    <circle cx="10.5" cy="9" r="1" fill="currentColor" />
  </svg>
);

const IconChart = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <polyline points="1,11 4,7 7,9 10,4 13,6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconShield = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 1l5 2v4c0 3-2.5 5-5 6C4.5 12 2 10 2 7V3l5-2z" stroke="currentColor" strokeWidth="1.3" />
  </svg>
);

const IconBell = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 1a4 4 0 014 4v3l1 1H2l1-1V5a4 4 0 014-4z" stroke="currentColor" strokeWidth="1.3" />
    <path d="M5.5 12a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.3" />
  </svg>
);

// ── Data ────────────────────────────────────────────────────────
const currencyOptions: DropdownOption[] = [
  { value: "inr", label: "Indian Rupee", description: "₹ INR", icon: <IconWallet />, badge: "Default" },
  { value: "usd", label: "US Dollar",    description: "$ USD", icon: <IconWallet /> },
  { value: "eur", label: "Euro",         description: "€ EUR", icon: <IconWallet /> },
  { value: "gbp", label: "British Pound",description: "£ GBP", icon: <IconWallet /> },
  { value: "jpy", label: "Japanese Yen", description: "¥ JPY", icon: <IconWallet />, disabled: true, badge: "Soon" },
];

const accountOptions: DropdownOption[] = [
  { value: "savings",  label: "Savings Account",  description: "₹1,20,000 available", icon: <IconShield /> },
  { value: "current",  label: "Current Account",  description: "₹80,500 available",   icon: <IconShield /> },
  { value: "trading",  label: "Trading Account",  description: "₹44,500 available",   icon: <IconChart />, badge: "Live" },
];

// ────────────────────────────────────────────────────────────────

// ── Inline SVG icons used by nav demos ─────────────────────────
const IcoDashboard = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
    <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
    <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
    <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
  </svg>
);
const IcoTrend = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <polyline points="1,12 5,7 9,10 15,4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="11,4 15,4 15,8"     stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IcoPay = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="4" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M1 7h14" stroke="currentColor" strokeWidth="1.3"/>
    <circle cx="12" cy="10" r="1" fill="currentColor"/>
  </svg>
);
const IcoSave = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 2a4 4 0 014 4v3l1 1H3l1-1V6a4 4 0 014-4z" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M6.5 13a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.3"/>
  </svg>
);
const IcoSet = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M8 1v2M8 13v2M1 8h2M13 8h2M2.9 2.9l1.4 1.4M11.7 11.7l1.4 1.4M2.9 13.1l1.4-1.4M11.7 4.3l1.4-1.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);
const IcoBell = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 2a4 4 0 014 4v3l1 1H3l1-1V6a4 4 0 014-4z" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M6.5 13a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.3"/>
  </svg>
);
const IcoSearch = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="6.5" cy="6.5" r="4" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M10 10l4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);
const IcoHome = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M1 7L7 1l6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 5v6a1 1 0 001 1h2v-3h2v3h2a1 1 0 001-1V5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IcoReport = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="2" y="1" width="10" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M4 5h6M4 8h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

// ── Nav demo data ────────────────────────────────────────────────
const navItems: NavItem[] = [
  { key: "dashboard",    label: "Dashboard",    icon: <IcoDashboard />, active: true },
  { key: "portfolio",    label: "Portfolio",    icon: <IcoTrend /> },
  { key: "payments",     label: "Payments",     icon: <IcoPay />,   badge: 3 },
  { key: "savings",      label: "Savings",      icon: <IcoSave /> },
  { key: "settings",     label: "Settings",     icon: <IcoSet />,   disabled: true },
];

const navActions: NavbarAction[] = [
  { key: "search", icon: <IcoSearch />, label: "Search" },
  { key: "bell",   icon: <IcoBell />,   label: "Notifications", badge: 5 },
];

const sidebarGroups: SidebarGroup[] = [
  {
    label: "Overview",
    items: [
      { key: "dash",   label: "Dashboard",  icon: <IcoDashboard />, active: true },
      { key: "port",   label: "Portfolio",   icon: <IcoTrend />,    badge: "Live", badgeVariant: "success" },
    ],
  },
  {
    label: "Money",
    items: [
      { key: "pay",   label: "Payments",    icon: <IcoPay />,  badge: 3, badgeVariant: "info" },
      { key: "save",  label: "Savings",     icon: <IcoSave /> },
      { key: "rep",   label: "Reports",     icon: <IcoReport /> },
    ],
  },
  {
    label: "System",
    items: [
      { key: "set",   label: "Settings",    icon: <IcoSet /> },
      { key: "not",   label: "Notifications", icon: <IcoBell />, badge: 5, badgeVariant: "danger" },
    ],
  },
];

export function PlaygroundPage() {
  // Modal state
  const [basicModal, setBasicModal]       = useState(false);
  const [confirmModal, setConfirmModal]   = useState(false);
  const [formModal, setFormModal]         = useState(false);

  // Dropdown state
  const [currency, setCurrency]           = useState("inr");
  const [account, setAccount]             = useState("");

  // Sidebar collapse state (for demo)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#09090B] p-10 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-16">

        {/* HERO */}
        <section className="space-y-3">
          <Heading level={1}>FinanceSharks Design System</Heading>
          <Text className="max-w-2xl">
            Cinematic fintech components engineered for high-end product experiences.
          </Text>
        </section>

        {/* BUTTONS */}
        <section className="space-y-8">
          <Heading level={3}>Buttons</Heading>

          {/* All variants */}
          <div className="space-y-2">
            <Muted>Variants</Muted>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Launch Transfer</Button>
              <Button variant="glass">Open Workspace</Button>
              <Button variant="success">Payment Approved</Button>
              <Button variant="danger">Delete Account</Button>
              <Button variant="outline">View Statement</Button>
              <Button variant="ghost">Ghost Action</Button>
              <Button variant="gold" leftIcon={<Sparkles size={14} />}>Upgrade to Pro</Button>
            </div>
          </div>

          {/* Sizes */}
          <div className="space-y-2">
            <Muted>Sizes</Muted>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary" size="xs">X-Small</Button>
              <Button variant="primary" size="sm">Small</Button>
              <Button variant="primary" size="md">Medium</Button>
              <Button variant="primary" size="lg">Large</Button>
              <Button variant="primary" size="xl">Massive</Button>
            </div>
          </div>

          {/* With icons */}
          <div className="space-y-2">
            <Muted>With icons</Muted>
            <div className="flex flex-wrap gap-4">
              <Button
                variant="primary"
                leftIcon={
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                }
              >
                Add Account
              </Button>
              <Button
                variant="gold"
                leftIcon={
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M6.5 1l1.4 3.1 3.4.3-2.5 2.2.8 3.3L6.5 8.3 3.4 9.9l.8-3.3L1.7 4.4l3.4-.3z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
                  </svg>
                }
              >
                Go Premium
              </Button>
              <Button
                variant="success"
                leftIcon={
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M2 7l3 3 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                }
              >
                Confirm Payment
              </Button>
              <Button
                variant="glass"
                rightIcon={
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                }
              >
                View Portfolio
              </Button>
              <Button
                variant="danger"
                leftIcon={
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M2 3h9M5 3V2h3v1M4 3l.5 7h4L9 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                }
              >
                Delete Account
              </Button>
            </div>
          </div>

          {/* States */}
          <div className="space-y-2">
            <Muted>States</Muted>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" loading>Processing Payment</Button>
              <Button variant="glass" loading>Connecting Bank</Button>
              <Button variant="success" loading>Verifying</Button>
              <Button variant="primary" disabled>Disabled</Button>
              <Button variant="danger" disabled>Locked</Button>
            </div>
          </div>
        </section>

        {/* CARD */}
        <section className="space-y-8">
          <Heading level={3}>Card</Heading>
          <Card className="w-[420px]">
            <CardHeader>
              <div>
                <CardDescription>Total Balance</CardDescription>
                <CardTitle>₹2,45,000</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-400">+12.5% from last month</p>
            </CardContent>
          </Card>
        </section>

        {/* INPUT */}
        <section className="space-y-8">
          <Heading level={3}>Inputs</Heading>
          <InputGroup className="max-w-md">
            <InputLabel>Email Address</InputLabel>
            <Input type="email" placeholder="you@example.com" />
            <InputDescription>We'll never share your email.</InputDescription>
          </InputGroup>
        </section>

        {/* TYPOGRAPHY */}
        <section className="space-y-6">
          <Heading level={3}>Typography</Heading>
          <div className="space-y-4">
            <Heading level={1}>Welcome back</Heading>
            <Text>Track your financial growth with real-time insights.</Text>
            <Muted>Last updated 2 minutes ago</Muted>
            <Metric>₹2,45,000</Metric>
            <GradientText>+18.2% this month</GradientText>
          </div>
        </section>

        {/* BADGES */}
        <section className="space-y-8">
          <Heading level={3}>Badges</Heading>
          <div className="flex flex-wrap gap-3">
            <Badge>Default</Badge>
            <Badge variant="success">Completed</Badge>
            <Badge variant="danger">Failed</Badge>
            <Badge variant="warning">Pending</Badge>
            <Badge variant="info">Processing</Badge>
            <Badge variant="violet">Premium</Badge>
            <Badge variant="outline">Draft</Badge>
          </div>
        </section>

        {/* AVATARS */}
        <section className="space-y-8">
          <Heading level={3}>Avatars</Heading>
          <div className="flex items-end gap-6">
            <Avatar fallback="RK" size="sm" status="online" />
            <Avatar fallback="JS" size="lg" status="idle" />
            <Avatar fallback="AI" size="xl" status="dnd" />
            <Avatar fallback="OP" size="lg" status="offline" />
          </div>
        </section>

        {/* SKELETON */}
        <section className="space-y-8">
          <Heading level={3}>Skeletons</Heading>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[140px]" />
              </div>
            </div>
            <Skeleton className="h-[180px] w-full rounded-3xl" />
          </div>
        </section>

        {/* ── DROPDOWN ──────────────────────────────────────────── */}
        <section className="space-y-8">
          <Heading level={3}>Dropdown</Heading>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Default with icons + badge */}
            <Dropdown
              label="Currency"
              options={currencyOptions}
              value={currency}
              onChange={(v) => setCurrency(v)}
              helperText="Select your preferred currency"
              clearable
            />

            {/* Searchable */}
            <Dropdown
              label="Account"
              options={accountOptions}
              value={account}
              onChange={(v) => setAccount(v)}
              placeholder="Choose account…"
              searchable
              helperText="Type to search accounts"
            />

            {/* Pill variant */}
            <Dropdown
              label="Time Range"
              options={[
                { value: "7d",  label: "Last 7 days" },
                { value: "30d", label: "Last 30 days" },
                { value: "90d", label: "Last 90 days" },
                { value: "1y",  label: "This year" },
              ]}
              defaultValue="30d"
              variant="filled"
              helperText="Filter transactions by period"
            />

            {/* Ghost small */}
            <Dropdown
              label="Sort By"
              size="sm"
              variant="ghost"
              options={[
                { value: "date",   label: "Date" },
                { value: "amount", label: "Amount" },
                { value: "status", label: "Status" },
              ]}
              defaultValue="date"
            />

            {/* Error state */}
            <Dropdown
              label="Payment Method"
              options={[
                { value: "upi",  label: "UPI" },
                { value: "card", label: "Debit Card" },
                { value: "neft", label: "NEFT" },
              ]}
              error="Please select a payment method to continue"
            />

            {/* Disabled */}
            <Dropdown
              label="Region (locked)"
              options={[{ value: "in", label: "India" }]}
              defaultValue="in"
              disabled
              helperText="Contact support to change region"
            />
          </div>
        </section>

        {/* ── TABS ─────────────────────────────────────────────── */}
        <section className="space-y-10">
          <Heading level={3}>Tabs</Heading>

          {/* Line variant */}
          <div className="space-y-3">
            <Muted>Line (default)</Muted>
            <Tabs defaultValue="overview">
              <TabList>
                <Tab value="overview" icon={<IconChart />}>Overview</Tab>
                <Tab value="transactions" badge={12}>Transactions</Tab>
                <Tab value="analytics">Analytics</Tab>
                <Tab value="settings" disabled>Settings</Tab>
              </TabList>
              <TabPanels>
                <TabPanel value="overview">
                  <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-3">
                    <Text className="font-semibold">Portfolio Overview</Text>
                    <Metric>₹2,45,000</Metric>
                    <div className="flex gap-3">
                      <Badge variant="success">+18.2% this month</Badge>
                      <Badge variant="info">12 active positions</Badge>
                    </div>
                  </div>
                </TabPanel>
                <TabPanel value="transactions">
                  <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-3">
                    <Text className="font-semibold">Recent Transactions</Text>
                    {["UPI to Rahul — ₹2,500", "Amazon Pay — ₹1,299", "SIP Mutual Fund — ₹5,000"].map((t) => (
                      <div key={t} className="flex items-center justify-between border-b border-zinc-800 py-2">
                        <Muted>{t}</Muted>
                        <Badge variant="success">Done</Badge>
                      </div>
                    ))}
                  </div>
                </TabPanel>
                <TabPanel value="analytics">
                  <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
                    <Text className="font-semibold">Analytics</Text>
                    <Muted className="mt-2">Charts and reports will appear here.</Muted>
                  </div>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </div>

          {/* Pill variant */}
          <div className="space-y-3">
            <Muted>Pill</Muted>
            <Tabs defaultValue="all" variant="pill">
              <TabList>
                <Tab value="all">All</Tab>
                <Tab value="income">Income</Tab>
                <Tab value="expense">Expense</Tab>
                <Tab value="transfers">Transfers</Tab>
              </TabList>
              <TabPanels>
                <TabPanel value="all">
                  <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                    <Muted>Showing all transactions</Muted>
                  </div>
                </TabPanel>
                <TabPanel value="income">
                  <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                    <Muted>Income transactions only</Muted>
                  </div>
                </TabPanel>
                <TabPanel value="expense">
                  <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                    <Muted>Expense transactions only</Muted>
                  </div>
                </TabPanel>
                <TabPanel value="transfers">
                  <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                    <Muted>Transfer records</Muted>
                  </div>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </div>

          {/* Card variant */}
          <div className="space-y-3">
            <Muted>Card</Muted>
            <Tabs defaultValue="daily" variant="card">
              <TabList>
                <Tab value="daily">Daily</Tab>
                <Tab value="weekly">Weekly</Tab>
                <Tab value="monthly">Monthly</Tab>
              </TabList>
              <TabPanels>
                <TabPanel value="daily">
                  <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                    <GradientText>₹12,400</GradientText>
                    <Muted className="mt-1">Today's volume</Muted>
                  </div>
                </TabPanel>
                <TabPanel value="weekly">
                  <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                    <GradientText>₹68,200</GradientText>
                    <Muted className="mt-1">This week's volume</Muted>
                  </div>
                </TabPanel>
                <TabPanel value="monthly">
                  <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                    <GradientText>₹2,45,000</GradientText>
                    <Muted className="mt-1">This month's volume</Muted>
                  </div>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </div>
        </section>

        {/* ── TOOLTIP ───────────────────────────────────────────── */}
        <section className="space-y-8">
          <Heading level={3}>Tooltips</Heading>

          {/* Placements */}
          <div className="space-y-3">
            <Muted>Placements</Muted>
            <div className="flex flex-wrap gap-4">
              {(["top", "bottom", "left", "right"] as const).map((p) => (
                <Tooltip key={p} content={`Placement: ${p}`} placement={p}>
                  <Button variant="glass" size="sm">
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </Button>
                </Tooltip>
              ))}
            </div>
          </div>

          {/* Rich content */}
          <div className="space-y-3">
            <Muted>Rich content</Muted>
            <div className="flex flex-wrap gap-4">
              <Tooltip
                content={
                  <span>
                    <strong style={{ color: "#38bdf8" }}>Security Tip</strong>
                    <br />
                    Enable 2FA to protect your account from unauthorised access.
                  </span>
                }
                placement="top"
                interactive
                maxWidth={220}
              >
                <Button size="sm">
                  <IconShield /> &nbsp;Security Info
                </Button>
              </Tooltip>

              <Tooltip
                content="Your wallet balance updates every 30 seconds in real-time."
                placement="bottom"
              >
                <Badge variant="info" style={{ cursor: "default" }}>
                  Live Balance ⓘ
                </Badge>
              </Tooltip>

              <Tooltip content="This action cannot be undone." placement="top">
                <Button variant="danger" size="sm">Delete</Button>
              </Tooltip>

              <Tooltip content="Notifications are paused" placement="right">
                <button
                  style={{
                    background: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: 8,
                    padding: "8px 10px",
                    color: "#94a3b8",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <IconBell />
                </button>
              </Tooltip>
            </div>
          </div>

          {/* No arrow / delayed */}
          <div className="space-y-3">
            <Muted>No arrow · Long delay</Muted>
            <div className="flex flex-wrap gap-4">
              <Tooltip content="No arrow tooltip" arrow={false} placement="top">
                <Button variant="ghost" size="sm">No Arrow</Button>
              </Tooltip>

              <Tooltip content="Appears after 800ms" delay={800} placement="top">
                <Button variant="ghost" size="sm">Slow Reveal</Button>
              </Tooltip>

              <Tooltip content="This tooltip is disabled" disabled placement="top">
                <Button variant="ghost" size="sm" disabled>Disabled</Button>
              </Tooltip>
            </div>
          </div>
        </section>

        {/* ── MODAL ─────────────────────────────────────────────── */}
        <section className="space-y-8">
          <Heading level={3}>Modals</Heading>

          <div className="flex flex-wrap gap-4">
            {/* Basic info modal */}
            <Button variant="glass" onClick={() => setBasicModal(true)}>
              Info Modal
            </Button>

            {/* Confirm / danger modal */}
            <Button variant="danger" onClick={() => setConfirmModal(true)}>
              Confirm Action
            </Button>

            {/* Form modal */}
            <Button onClick={() => setFormModal(true)}>
              Transfer Funds
            </Button>
          </div>

          {/* ── Basic Modal ── */}
          <Modal
            open={basicModal}
            onClose={() => setBasicModal(false)}
            title="Account Summary"
            description="Here's a snapshot of your current financial standing."
            size="sm"
            footer={
              <Button size="sm" onClick={() => setBasicModal(false)}>
                Got it
              </Button>
            }
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-zinc-900 px-4 py-3">
                <Muted>Total Balance</Muted>
                <Metric>₹2,45,000</Metric>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-zinc-900 px-4 py-3">
                <Muted>This Month</Muted>
                <GradientText>+18.2%</GradientText>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-zinc-900 px-4 py-3">
                <Muted>Active SIPs</Muted>
                <Badge variant="info">3 running</Badge>
              </div>
            </div>
          </Modal>

          {/* ── Confirm / Danger Modal ── */}
          <Modal
            open={confirmModal}
            onClose={() => setConfirmModal(false)}
            title="Delete Account"
            description="This will permanently remove all your data and cannot be reversed."
            size="xs"
            footer={
              <>
                <Button variant="ghost" size="sm" onClick={() => setConfirmModal(false)}>
                  Cancel
                </Button>
                <Button variant="danger" size="sm" onClick={() => setConfirmModal(false)}>
                  Yes, Delete
                </Button>
              </>
            }
          >
            <div className="rounded-xl border border-red-900/40 bg-red-950/20 px-4 py-3">
              <Text className="text-sm text-red-400 flex items-center gap-2">
                <AlertTriangle size={16} /> You will lose all transaction history, saved accounts, and preferences.
              </Text>
            </div>
          </Modal>

          {/* ── Form Modal ── */}
          <Modal
            open={formModal}
            onClose={() => setFormModal(false)}
            title="Transfer Funds"
            description="Send money instantly via UPI or bank transfer."
            size="md"
            footer={
              <>
                <Button variant="ghost" size="sm" onClick={() => setFormModal(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={() => setFormModal(false)}>
                  Send Money
                </Button>
              </>
            }
          >
            <div className="space-y-5">
              <InputGroup>
                <InputLabel>Recipient UPI / Account</InputLabel>
                <Input placeholder="name@upi or account number" />
              </InputGroup>

              <InputGroup>
                <InputLabel>Amount (₹)</InputLabel>
                <Input type="number" placeholder="0.00" />
                <InputDescription>Minimum transfer: ₹1</InputDescription>
              </InputGroup>

              <Dropdown
                label="From Account"
                options={accountOptions}
                defaultValue="savings"
                size="md"
              />

              <InputGroup>
                <InputLabel>Note (optional)</InputLabel>
                <Input placeholder="e.g. Rent for June" />
              </InputGroup>
            </div>
          </Modal>
        </section>

        {/* ── NAVIGATION ─────────────────────────────────────────── */}
        <section className="space-y-12">
          <Heading level={3}>Navigation</Heading>

          {/* ── Navbar ── */}
          <div className="space-y-4">
            <Muted>Navbar — glass top-bar with links, action icons &amp; mobile drawer</Muted>
            <div className="overflow-hidden rounded-2xl border border-zinc-800">
              <Navbar
                appName="FinanceSharks"
                items={navItems}
                actions={navActions}
                userSlot={
                  <Avatar fallback="RK" size="sm" status="online" />
                }
              />
              <div className="bg-zinc-900/60 px-6 py-4">
                <Muted>↑ Resize the window to see the mobile hamburger menu</Muted>
              </div>
            </div>

            {/* Sticky navbar note */}
            <div className="flex flex-wrap gap-3">
              <Badge variant="info">sticky prop</Badge>
              <Badge variant="default">mobile drawer</Badge>
              <Badge variant="success">active link underline</Badge>
              <Badge variant="warning">badge count</Badge>
              <Badge variant="violet">glass morphism</Badge>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-4">
            <Muted>Sidebar — collapsible rail with groups, badges &amp; hover tooltips</Muted>
            <div className="flex overflow-hidden rounded-2xl border border-zinc-800" style={{ height: 340 }}>
              <Sidebar
                groups={sidebarGroups}
                collapsed={sidebarCollapsed}
                onCollapsedChange={setSidebarCollapsed}
                footer={
                  !sidebarCollapsed ? (
                    <div className="flex items-center gap-3 px-2 py-1">
                      <Avatar fallback="RK" size="sm" status="online" />
                      <div>
                        <Text className="text-xs font-semibold leading-tight">Rahul Kumar</Text>
                        <Muted className="text-[11px]">Pro Plan</Muted>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-center">
                      <Avatar fallback="RK" size="sm" status="online" />
                    </div>
                  )
                }
              />
              <div className="flex flex-1 flex-col gap-3 bg-zinc-900/60 p-6">
                <Text className="font-semibold">Dashboard</Text>
                <Muted>Click the ‹ toggle on the sidebar edge to collapse it to icon-only rail mode.</Muted>
                <div className="mt-2 flex gap-2">
                  <Badge variant="info">grouped items</Badge>
                  <Badge variant="success">hover tooltips</Badge>
                  <Badge variant="default">badge variants</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* ── Breadcrumbs ── */}
          <div className="space-y-6">
            <Muted>Breadcrumbs — three variants with collapse &amp; custom separators</Muted>

            <div className="space-y-2">
              <Muted>Default</Muted>
              <Breadcrumbs
                items={[
                  { label: "Home",      icon: <IcoHome />,   onClick: () => {} },
                  { label: "Finance",                        onClick: () => {} },
                  { label: "Portfolio",                      onClick: () => {} },
                  { label: "Overview" },
                ]}
              />
            </div>

            <div className="space-y-2">
              <Muted>Ghost</Muted>
              <Breadcrumbs
                variant="ghost"
                items={[
                  { label: "Home",        onClick: () => {} },
                  { label: "Transactions",onClick: () => {} },
                  { label: "May 2026",    onClick: () => {} },
                  { label: "#TXN-00821" },
                ]}
              />
            </div>

            <div className="space-y-2">
              <Muted>Pill</Muted>
              <Breadcrumbs
                variant="pill"
                items={[
                  { label: "Home",     onClick: () => {} },
                  { label: "Savings",  onClick: () => {} },
                  { label: "SIP Plan" },
                ]}
              />
            </div>

            <div className="space-y-2">
              <Muted>Auto-collapse (maxItems=4) — 6 items collapses to ···</Muted>
              <Breadcrumbs
                maxItems={4}
                items={[
                  { label: "Home",       onClick: () => {} },
                  { label: "Finance",    onClick: () => {} },
                  { label: "Portfolio",  onClick: () => {} },
                  { label: "Equities",   onClick: () => {} },
                  { label: "NSE",        onClick: () => {} },
                  { label: "RELIANCE" },
                ]}
              />
            </div>

            <div className="space-y-2">
              <Muted>Custom separator — dot</Muted>
              <Breadcrumbs
                separator={<span style={{ color: '#38bdf8', fontSize: '1rem', lineHeight: 1 }}>·</span>}
                items={[
                  { label: "Dashboard",  onClick: () => {} },
                  { label: "Reports",    onClick: () => {} },
                  { label: "Q1 2026" },
                ]}
              />
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}