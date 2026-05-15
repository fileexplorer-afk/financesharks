import { motion } from 'framer-motion';
import { Crown, FileText } from 'lucide-react';
import { AppLayout } from '@/components/layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heading, Text, Muted } from '@/components/ui/typography';
import { useFamily, useFeatureGates } from '@/hooks';

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

export function CollaborationPage() {
  const { hasFeature } = useFeatureGates();
  const { members } = useFamily();

  if (!hasFeature('family-collaboration')) {
    return (
      <AppLayout activeKey="collab">
        <motion.div
          initial="hidden"
          animate="show"
          variants={container}
          className="min-h-screen bg-[var(--bg-primary)] p-6 flex items-center justify-center"
        >
          <div className="text-center">
            <Heading level={2} className="mb-4">Premium Feature</Heading>
            <Text className="text-[var(--text-secondary)] mb-6">
              Upgrade to Premium to manage family finances together.
            </Text>
          </div>
        </motion.div>
      </AppLayout>
    );
  }

  return (
    <AppLayout activeKey="collab">
      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="min-h-screen bg-[var(--bg-primary)] p-4 sm:p-6"
      >
        <motion.div variants={item} className="mb-8">
          <Heading level={1} className="mb-2">Family Collaboration</Heading>
          <Text className="text-[var(--text-secondary)]">Manage household finances together.</Text>
        </motion.div>

        <motion.div variants={container} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Members List */}
          <motion.div variants={item} className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Family Members</CardTitle>
                <CardDescription>{members.length} members in this household</CardDescription>
              </CardHeader>
              <CardContent>
                <motion.div variants={container} className="space-y-4">
                  {members.map((member) => (
                    <motion.div
                      key={member.id}
                      variants={item}
                      className="flex items-center justify-between p-4 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)]"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <Avatar fallback={member.name.split(' ').map(n => n[0]).join('')} size="lg" status="online" />
                        <div>
                          <Text className="font-semibold">{member.name}</Text>
                          <Muted className="text-sm">{member.email}</Muted>
                          <div className="mt-1 flex items-center gap-2">
                              <Badge variant={member.role === 'owner' ? 'success' : 'info'}>
                                {member.role === 'owner' ? <><Crown size={12} className="inline mr-1" /> Owner</> : 'Member'}
                              </Badge>
                            <Muted className="text-xs">Joined {member.joinedAt}</Muted>
                          </div>
                        </div>
                      </div>
                      {member.role !== 'owner' && (
                        <Button variant="ghost" size="sm">Manage</Button>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              </CardContent>
            </Card>

            {/* Shared Budget */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Shared Budget</CardTitle>
                <CardDescription>Household spending limits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Groceries', 'Utilities', 'Entertainment', 'Transport'].map((cat) => (
                    <div key={cat} className="p-4 rounded-lg bg-[var(--bg-secondary)]">
                      <div className="flex items-center justify-between mb-2">
                        <Text className="font-medium">{cat}</Text>
                        <Text className="font-semibold">75%</Text>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
                        <div className="h-full w-3/4 bg-[var(--color-accent)]" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={item} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="gold" className="w-full">Invite Member</Button>
                <Button variant="glass" className="w-full">Set Budget Limits</Button>
                <Button variant="outline" className="w-full">Activity Log</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText size={18} className="text-[var(--color-accent)]" /> Permissions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Text className="text-sm font-medium">Owner</Text>
                  <Muted className="text-xs">Full access to all features</Muted>
                </div>
                <div>
                  <Text className="text-sm font-medium">Member</Text>
                  <Muted className="text-xs">View & create transactions</Muted>
                </div>
                <div>
                  <Text className="text-sm font-medium">Viewer</Text>
                  <Muted className="text-xs">View-only access</Muted>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}
