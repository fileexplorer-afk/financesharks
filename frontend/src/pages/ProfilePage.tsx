import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Camera, Users, Building, Mail, Calendar, ShieldCheck, Pencil } from "lucide-react";
import { AppLayout } from "@/components/layout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Heading, Text, Muted } from "@/components/ui/typography";
import { Input, InputGroup, InputLabel } from "@/components/ui/input";
import { useUser, useFamily } from "@/hooks";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const associations = [
  { name: "FinanceSharks Inc.", role: "Account Owner", icon: <Building size={18} />, since: "Jan 2024" },
  { name: "Singh Family Trust", role: "Trustee", icon: <ShieldCheck size={18} />, since: "Mar 2024" },
  { name: "Startup Accelerator Fund", role: "Investor", icon: <Building size={18} />, since: "Jun 2024" },
];

export function ProfilePage() {
  const { user } = useUser();
  const { members } = useFamily();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setAvatarSrc(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <AppLayout activeKey="profile">
      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="min-h-screen bg-[var(--bg-primary)] p-4 sm:p-6"
      >
        <motion.div variants={item} className="mb-8">
          <Heading level={1} className="mb-2">My Profile</Heading>
          <Text className="text-[var(--text-secondary)]">Manage your personal information, family, and associations.</Text>
        </motion.div>

        <motion.div variants={container} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div variants={item} className="lg:col-span-1 space-y-6">
            <Card>
              <CardContent className="pt-8">
                <div className="flex flex-col items-center text-center">
                  <div className="relative group mb-4">
                    <Avatar
                      src={avatarSrc || undefined}
                      fallback={user.name.split(" ").map(n => n[0]).join("")}
                      size="xl"
                      status="online"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Camera size={22} className="text-white" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </div>
                  <Heading level={4}>{user.name}</Heading>
                  <Muted className="text-sm">{user.email}</Muted>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="violet" size="sm" className="capitalize">{user.tier}</Badge>
                    <Badge variant="success" size="sm">Verified</Badge>
                  </div>

                  <div className="w-full mt-6 space-y-3 text-left">
                    <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                      <Mail size={14} className="text-[var(--text-tertiary)] shrink-0" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                      <Calendar size={14} className="text-[var(--text-tertiary)] shrink-0" />
                      <span>Joined {user.joinedAt}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                      <ShieldCheck size={14} className="text-[var(--text-tertiary)] shrink-0" />
                      <span className="capitalize">{user.tier} plan</span>
                    </div>
                  </div>

                  <Button
                    variant="glass"
                    size="sm"
                    className="w-full mt-6"
                    leftIcon={<Pencil size={14} />}
                    onClick={() => setEditing(!editing)}
                  >
                    {editing ? "Cancel" : "Edit Profile"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item} className="lg:col-span-2 space-y-6">
            {editing && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>Edit Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputGroup>
                        <InputLabel>Full Name</InputLabel>
                        <Input defaultValue={user.name} />
                      </InputGroup>
                      <InputGroup>
                        <InputLabel>Email</InputLabel>
                        <Input type="email" defaultValue={user.email} />
                      </InputGroup>
                      <InputGroup>
                        <InputLabel>Phone</InputLabel>
                        <Input defaultValue="+91 98765 43210" />
                      </InputGroup>
                      <InputGroup>
                        <InputLabel>Location</InputLabel>
                        <Input defaultValue="Mumbai, India" />
                      </InputGroup>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <Button variant="primary" size="sm">Save Changes</Button>
                      <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>Cancel</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users size={18} className="text-[var(--color-accent)]" /> Family Members
                </CardTitle>
                <CardDescription>{members.length} members in your household</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar
                          fallback={member.name.split(" ").map(n => n[0]).join("")}
                          size="md"
                          status={member.role === "owner" ? "online" : "idle"}
                        />
                        <div>
                          <Text className="text-sm font-medium">{member.name}</Text>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Muted className="text-xs">{member.email}</Muted>
                            <Badge variant={member.role === "owner" ? "success" : "info"} size="sm">
                              {member.role === "owner" ? "Owner" : "Member"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      {member.role !== "owner" && (
                        <Badge variant="violet" size="sm" className="cursor-pointer">Manage</Badge>
                      )}
                    </div>
                  ))}
                  <Button variant="glass" size="sm" className="w-full mt-2">
                    <Users size={14} /> Invite New Member
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building size={18} className="text-[var(--color-accent)]" /> Associations
                </CardTitle>
                <CardDescription>Accounts and organizations you're connected to</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {associations.map((a, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-accent)]/20 to-[var(--color-accent)]/5 flex items-center justify-center text-[var(--color-accent)]">
                          {a.icon}
                        </div>
                        <div>
                          <Text className="text-sm font-medium">{a.name}</Text>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge variant="violet" size="sm">{a.role}</Badge>
                            <Muted className="text-xs">Since {a.since}</Muted>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="xs">View</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}
