import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { Sun, Moon, User, Users, Building, Settings, LogOut } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/navigation/navbar';
import { Sidebar } from '@/components/navigation/sidebar';
import { Avatar } from '@/components/ui/avatar';
import { Text, Muted } from '@/components/ui/typography';
import { useUser } from '@/hooks';
import { useTheme } from '@/hooks/useTheme';
import type { NavItem, NavbarAction, SidebarGroup, SidebarItem } from '@/components/navigation';

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
    <polyline points="11,4 15,4 15,8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IcoPay = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="4" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M1 7h14" stroke="currentColor" strokeWidth="1.3"/>
    <circle cx="12" cy="10" r="1" fill="currentColor"/>
  </svg>
);

const IcoTarget = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.3"/>
    <circle cx="8" cy="8" r="4.5" stroke="currentColor" strokeWidth="1.3"/>
    <circle cx="8" cy="8" r="2" fill="currentColor"/>
  </svg>
);

const IcoChart = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <polyline points="1,11 4,7 7,9 10,4 13,6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IcoStar = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 1l1.5 3.5H13l-3 2.5 1.5 3.5-3-2.5-3 2.5 1.5-3.5-3-2.5h3.5L8 1z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
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

interface AppLayoutProps {
  children: React.ReactNode;
  activeKey: string;
}

const routeMap: Record<string, string> = {
  dashboard: '/dashboard',
  portfolio: '/portfolio',
  transactions: '/transactions',
  goals: '/goals',
  insights: '/insights',
  collab: '/collaboration',
  reports: '/reports',
  settings: '/settings',
  pricing: '/pricing',
  profile: '/profile',
  family: '/collaboration',
  associations: '/settings',
};

const profileMenu = [
  { key: 'profile', label: 'My Profile', icon: <User size={15} />, desc: 'Manage your personal info' },
  { key: 'family', label: 'Family Members', icon: <Users size={15} />, desc: 'Household collaboration' },
  { key: 'associations', label: 'Associations', icon: <Building size={15} />, desc: 'Connected accounts & orgs' },
  { key: 'settings', label: 'Settings', icon: <Settings size={15} />, desc: 'Preferences & security' },
];

export function AppLayout({ children, activeKey }: AppLayoutProps) {
  const { user } = useUser();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileTriggerRef = useRef<HTMLButtonElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const [profilePos, setProfilePos] = useState({ top: 0, right: 0 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        !profileTriggerRef.current?.contains(e.target as Node) &&
        !profileDropdownRef.current?.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggleProfile = useCallback(() => {
    const next = !profileOpen;
    if (next && profileTriggerRef.current) {
      const rect = profileTriggerRef.current.getBoundingClientRect();
      setProfilePos({ top: rect.bottom + 8, right: window.innerWidth - rect.right });
    }
    setProfileOpen(next);
  }, [profileOpen]);

  const go = useCallback((key: string) => {
    const path = routeMap[key];
    if (path) navigate(path);
  }, [navigate]);

  const navItems: NavItem[] = [
    { key: 'dashboard', label: 'Dashboard', icon: <IcoDashboard />, active: activeKey === 'dashboard', onClick: () => go('dashboard') },
    { key: 'portfolio', label: 'Portfolio', icon: <IcoTrend />, onClick: () => go('portfolio') },
    { key: 'transactions', label: 'Transactions', icon: <IcoPay />, onClick: () => go('transactions') },
    { key: 'goals', label: 'Goals', icon: <IcoTarget />, onClick: () => go('goals') },
  ];

  const navActions: NavbarAction[] = [
    { key: 'search', icon: <IcoSearch />, label: 'Search' },
    { key: 'theme', icon: theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />, label: theme === 'dark' ? 'Light mode' : 'Dark mode', onClick: toggleTheme },
    { key: 'bell', icon: <IcoBell />, label: 'Notifications', badge: 3 },
  ];

  const sidebarItem = (key: string, label: string, icon: React.ReactNode, extra?: Partial<SidebarItem>): SidebarItem => ({
    key, label, icon, active: activeKey === key, onClick: () => go(key), ...extra,
  });

  const sidebarGroups: SidebarGroup[] = [
    {
      label: 'Overview',
      items: [
        sidebarItem('dashboard', 'Dashboard', <IcoDashboard />),
        sidebarItem('portfolio', 'Portfolio', <IcoTrend />),
      ],
    },
    {
      label: 'Money',
      items: [
        sidebarItem('transactions', 'Transactions', <IcoPay />),
        sidebarItem('goals', 'Goals', <IcoTarget />),
        sidebarItem('reports', 'Reports', <IcoChart />),
      ],
    },
    {
      label: 'Premium',
      items: [
        sidebarItem('insights', 'Insights', <IcoStar />, user.tier !== 'premium' ? { badge: 'Pro' } : {}),
        sidebarItem('collab', 'Collaboration', <IcoStar />, user.tier !== 'premium' ? { badge: 'Pro' } : {}),
      ],
    },
    {
      label: 'System',
      items: [
        sidebarItem('settings', 'Settings', <IcoSet />),
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Navbar
        appName="FinanceSharks"
        items={navItems}
        actions={navActions}
        userSlot={
          <div className="relative">
            <button
              ref={profileTriggerRef}
              onClick={toggleProfile}
              className="focus:outline-none"
              aria-label="Open profile menu"
            >
              <Avatar fallback={user.name.split(' ').map(n => n[0]).join('')} size="sm" status="online" />
            </button>
            {typeof document !== 'undefined' && createPortal(
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    ref={profileDropdownRef}
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    style={{ position: 'fixed', top: profilePos.top, right: profilePos.right }}
                    className="w-64 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] shadow-xl shadow-black/30 backdrop-blur-xl overflow-hidden z-[99999]"
                  >
                    <div className="p-4 border-b border-[var(--border-color)]">
                      <div className="flex items-center gap-3">
                        <Avatar fallback={user.name.split(' ').map(n => n[0]).join('')} size="md" status="online" />
                        <div>
                          <Text className="text-sm font-semibold">{user.name}</Text>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Muted className="text-xs">{user.email}</Muted>
                            <Badge variant="violet" size="sm">{user.tier}</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      {profileMenu.map((item) => (
                        <button
                          key={item.key}
                          onClick={() => { setProfileOpen(false); go(item.key); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--color-accent)]/10 transition-colors text-left"
                        >
                          <span className="text-[var(--text-tertiary)]">{item.icon}</span>
                          <div>
                            <Text className="text-sm font-medium">{item.label}</Text>
                            <Text className="text-xs text-[var(--text-tertiary)]">{item.desc}</Text>
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="p-2 border-t border-[var(--border-color)]">
                      <button
                        onClick={() => { setProfileOpen(false); navigate('/login'); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[var(--color-danger)] hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut size={15} />
                        <span className="font-medium">Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>,
              document.body
            )}
          </div>
        }
      />

      <div className="flex" style={{ height: 'calc(100vh - 64px)' }}>
        <div className="hidden lg:block">
          <Sidebar
            groups={sidebarGroups}
            collapsed={sidebarCollapsed}
            onCollapsedChange={setSidebarCollapsed}
            footer={
              !sidebarCollapsed ? (
                <div className="flex items-center gap-3 px-2 py-1">
                  <Avatar fallback={user.name.split(' ').map(n => n[0]).join('')} size="sm" status="online" />
                  <div>
                    <Text className="text-xs font-semibold leading-tight">{user.name}</Text>
                    <Muted className="text-[11px]">{user.tier.charAt(0).toUpperCase() + user.tier.slice(1)}</Muted>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center">
                  <Avatar fallback={user.name.split(' ').map(n => n[0]).join('')} size="sm" status="online" />
                </div>
              )
            }
          />
        </div>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
