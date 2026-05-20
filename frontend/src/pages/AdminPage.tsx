import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Building2, ArrowUpDown, Trash2, Crown, UserCog } from 'lucide-react';
import { AppLayout } from '@/components/layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Heading, Text, Muted } from '@/components/ui/typography';
import { Skeleton } from '@/components/ui/skeleton';
import * as adminApi from '@/services/api/admin.api';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export function AdminPage() {
  const [users, setUsers] = useState<adminApi.AdminUser[]>([]);
  const [stats, setStats] = useState<adminApi.AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'name' | 'email' | 'role' | 'createdAt'>('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const fetch = async () => {
      try {
        const [usersData, statsData] = await Promise.all([
          adminApi.getUsers(),
          adminApi.getStats(),
        ]);
        setUsers(usersData);
        setStats(statsData);
      } catch { /* ignore */ } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const sorted = [...users].sort((a, b) => {
    const dir = sortDir === 'asc' ? 1 : -1;
    if (sortBy === 'createdAt') return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * dir;
    return (a[sortBy] > b[sortBy] ? 1 : -1) * dir;
  });

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortDir('asc'); }
  };

  const handleRoleToggle = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      const updated = await adminApi.updateUserRole(userId, newRole);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: updated.role } : u));
    } catch { /* ignore */ }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Delete this user and all their data? This cannot be undone.')) return;
    try {
      await adminApi.deleteUser(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
      setStats(prev => prev ? { ...prev, totalUsers: prev.totalUsers - 1 } : prev);
    } catch { /* ignore */ }
  };

  return (
    <AppLayout activeKey="admin">
      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="min-h-screen bg-[var(--bg-primary)] p-4 sm:p-6"
      >
        <motion.div variants={item} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield size={24} className="text-[var(--color-accent)]" />
            <Heading level={1}>Admin Panel</Heading>
          </div>
          <Text className="text-[var(--text-secondary)]">Manage users, roles, and monitor system health.</Text>
        </motion.div>

        {/* Stats */}
        <motion.div variants={container} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Users', value: stats?.totalUsers, icon: <Users size={16} /> },
            { label: 'Accounts', value: stats?.totalAccounts, icon: <Building2 size={16} /> },
            { label: 'Transactions', value: stats?.totalTransactions, icon: <ArrowUpDown size={16} /> },
            { label: 'Goals', value: stats?.totalGoals, icon: <Crown size={16} /> },
            { label: 'Active Today', value: stats?.activeUsersToday, icon: <UserCog size={16} /> },
          ].map((s, i) => (
            <motion.div key={i} variants={item}>
              <Card>
                <CardHeader>
                  <CardDescription className="flex items-center gap-2">
                    {s.icon} {s.label}
                  </CardDescription>
                  {loading ? <Skeleton className="h-9 w-16 mt-1" /> : <CardTitle className="text-3xl">{s.value ?? '-'}</CardTitle>}
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Users Table */}
        <motion.div variants={item}>
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>{users.length} registered users</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border-color)] text-[var(--text-tertiary)]">
                      <th className="text-left p-4 font-medium">User</th>
                      {(['name', 'email', 'role', 'createdAt'] as const).map(f => (
                        <th key={f} className="text-left p-4 font-medium">
                          <button onClick={() => toggleSort(f)} className="flex items-center gap-1 hover:text-[var(--text-primary)] transition-colors">
                            {f === 'createdAt' ? 'Joined' : f.charAt(0).toUpperCase() + f.slice(1)}
                            {sortBy === f && <span className="text-xs">{sortDir === 'asc' ? '▲' : '▼'}</span>}
                          </button>
                        </th>
                      ))}
                      <th className="text-right p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i} className="border-b border-[var(--border-color)]">
                          <td className="p-4" colSpan={5}><Skeleton className="h-10 w-full" /></td>
                        </tr>
                      ))
                    ) : sorted.map((u) => (
                      <tr key={u.id} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-secondary)]/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar fallback={u.name.split(' ').map(n => n[0]).join('')} size="sm" />
                            <div>
                              <Text className="font-medium text-sm">{u.name}</Text>
                              <Muted className="text-xs">{u.tier}</Muted>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-[var(--text-secondary)]">{u.email}</td>
                        <td className="p-4">
                          <Badge variant={u.role === 'admin' ? 'success' : 'info'}>{u.role}</Badge>
                        </td>
                        <td className="p-4 text-[var(--text-secondary)] text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="xs"
                              onClick={() => handleRoleToggle(u.id, u.role)}
                              title={u.role === 'admin' ? 'Demote to user' : 'Promote to admin'}
                            >
                              <UserCog size={14} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="xs"
                              onClick={() => handleDelete(u.id)}
                              className="text-[var(--color-danger)] hover:bg-red-500/10"
                              title="Delete user"
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}
