'use client';

import * as React from 'react';
import { Card, CardContent } from '@/client/components/ui/card';
import { Button } from '@/client/components/ui/button';
import { Badge } from '@/client/components/ui/badge';
import { PendingUsersTable } from './pending-users-table';
import { ApprovedUsersTable } from './approved-users-table';
import { DirectoryAdminTable } from './directory-admin-table';
import { AddSessionDialog } from './add-session-dialog';
import { ProfileFormDialog } from './profile-form-dialog';
import { logoutAction } from '@/server/actions/auth.actions';
import type { ProfileRecord, SessionRecord, UserProfileRecord } from '@/server/db/schema.types';
import {
  LayoutGrid,
  Inbox,
  Users,
  Folder,
  TrendingUp,
  LogOut,
  Shield,
  Clock,
  CheckCircle2,
  Layers,
  Building2,
  UserPlus,
  FolderPlus,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/client/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminDashboardViewProps {
  adminUser: UserProfileRecord;
  pendingUsers: UserProfileRecord[];
  approvedUsers: UserProfileRecord[];
  profiles: ProfileRecord[];
  sessions: SessionRecord[];
}

export function AdminDashboardView({
  adminUser,
  pendingUsers,
  approvedUsers,
  profiles,
  sessions,
}: AdminDashboardViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<string>('dashboard');
  const [isSessionModalOpen, setIsSessionModalOpen] = React.useState(false);
  const [isAddProfileModalOpen, setIsAddProfileModalOpen] = React.useState(false);

  const handleLogout = async () => {
    await logoutAction();
    router.push('/login');
    router.refresh();
  };

  const tabs = [
    {
      id: 'dashboard',
      label: 'Overview',
      icon: LayoutGrid,
      badge: undefined,
    },
    {
      id: 'pending',
      label: 'Approvals',
      badge: pendingUsers.length > 0 ? pendingUsers.length : undefined,
      icon: Inbox,
    },
    {
      id: 'users',
      label: 'Members',
      badge: approvedUsers.length,
      icon: Users,
    },
    {
      id: 'directory',
      label: 'Directory Records',
      badge: profiles.length,
      icon: Folder,
    },
    {
      id: 'batches',
      label: 'Academic Batches',
      badge: sessions.length,
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-6 w-full">
      
      {/* Admin Header Card */}
      <div className="p-6 bg-card rounded-3xl border border-border/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-black text-sm shadow-md shrink-0">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                {adminUser.name}
              </h1>
              <Badge variant="default" className="text-xs">
                System Administrator
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              ID: {adminUser.student_id} • Email: {adminUser.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setIsAddProfileModalOpen(true)}
            className="gap-1.5 text-xs font-semibold shadow-sm h-9"
          >
            <UserPlus className="h-3.5 w-3.5" /> Add Profile
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsSessionModalOpen(true)}
            className="gap-1.5 text-xs font-semibold h-9"
          >
            <FolderPlus className="h-3.5 w-3.5" /> Add Batch
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="gap-1.5 text-xs text-destructive hover:bg-destructive/10 h-9"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign Out
          </Button>
        </div>
      </div>

      {/* Modern Sub-Options Horizontal Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#F6F6F9] dark:bg-[#15151A] border border-border/80 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-150 shrink-0 select-none',
                isActive
                  ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={cn(
                    'text-[10px] font-extrabold px-1.5 py-0.2 rounded-full min-w-[18px] text-center',
                    isActive
                      ? 'bg-primary/15 text-primary'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Content Panels */}
      <AnimatePresence mode="wait">
        
        {/* Tab 1: Overview */}
        {activeTab === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.16 }}
            className="space-y-6"
          >
            {/* Stats Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                onClick={() => setActiveTab('pending')}
                className="cursor-pointer p-4 bg-card rounded-2xl border border-border/80 hover:border-amber-500/50 transition-all shadow-sm group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-muted-foreground">Pending Approvals</span>
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-900 dark:text-amber-300">
                    <Clock className="h-4 w-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-foreground">{pendingUsers.length}</p>
                <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-1">Review registrations →</p>
              </div>

              <div
                onClick={() => setActiveTab('users')}
                className="cursor-pointer p-4 bg-card rounded-2xl border border-border/80 hover:border-emerald-500/50 transition-all shadow-sm group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-muted-foreground">Active Members</span>
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-900 dark:text-emerald-300">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-foreground">{approvedUsers.length}</p>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1">Manage user roles →</p>
              </div>

              <div
                onClick={() => setActiveTab('directory')}
                className="cursor-pointer p-4 bg-card rounded-2xl border border-border/80 hover:border-primary/50 transition-all shadow-sm group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-muted-foreground">Directory Profiles</span>
                  <div className="p-2 rounded-xl bg-primary/10 text-primary">
                    <Layers className="h-4 w-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-foreground">{profiles.length}</p>
                <p className="text-[11px] text-primary mt-1">View directory list →</p>
              </div>

              <div
                onClick={() => setActiveTab('batches')}
                className="cursor-pointer p-4 bg-card rounded-2xl border border-border/80 hover:border-zinc-400 transition-all shadow-sm group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-muted-foreground">Academic Batches</span>
                  <div className="p-2 rounded-xl bg-muted text-foreground">
                    <Building2 className="h-4 w-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-foreground">{sessions.length}</p>
                <p className="text-[11px] text-muted-foreground mt-1">CSE 01 to CSE 15 →</p>
              </div>
            </div>

            {/* Quick Table View */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-foreground">Recent Pending Queue</h3>
                <Button variant="ghost" size="sm" onClick={() => setActiveTab('pending')} className="text-xs">
                  View All ({pendingUsers.length})
                </Button>
              </div>
              <PendingUsersTable pendingUsers={pendingUsers.slice(0, 5)} />
            </div>
          </motion.div>
        )}

        {/* Tab 2: Pending Approvals */}
        {activeTab === 'pending' && (
          <motion.div
            key="pending"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.16 }}
            className="space-y-4"
          >
            <div className="p-5 bg-card rounded-3xl border border-border/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-bold text-foreground">
                    Pending Registrations
                  </h2>
                  <Badge variant="outline" className="text-xs gap-1 border-amber-500/40 text-amber-900 dark:text-amber-300 bg-amber-500/10">
                    <Clock className="h-3 w-3" /> {pendingUsers.length} Needs Review
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Review and approve new member accounts. Rejected registrations will be permanently deleted.
                </p>
              </div>
            </div>

            <PendingUsersTable pendingUsers={pendingUsers} />
          </motion.div>
        )}

        {/* Tab 3: Approved Members */}
        {activeTab === 'users' && (
          <motion.div
            key="users"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.16 }}
            className="space-y-4"
          >
            <div className="p-5 bg-card rounded-3xl border border-border/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-bold text-foreground">
                    Approved Department Members
                  </h2>
                  <Badge variant="outline" className="text-xs gap-1 border-emerald-500/40 text-emerald-900 dark:text-emerald-300 bg-emerald-500/10">
                    <CheckCircle2 className="h-3 w-3" /> {approvedUsers.length} Active Members
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Manage permission roles (Admin vs Standard Member) for approved departmental accounts.
                </p>
              </div>
            </div>

            <ApprovedUsersTable approvedUsers={approvedUsers} />
          </motion.div>
        )}

        {/* Tab 4: Directory Management */}
        {activeTab === 'directory' && (
          <motion.div
            key="directory"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.16 }}
            className="space-y-4"
          >
            <div className="p-5 bg-card rounded-3xl border border-border/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-bold text-foreground">
                    Student & Alumni Directory Records
                  </h2>
                  <Badge variant="outline" className="text-xs gap-1 border-primary/40 text-primary bg-primary/10">
                    <Layers className="h-3 w-3" /> {profiles.length} Profiles
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Full CRUD moderation: search, filter by batch, add, edit, or delete any record. Sorted by Student ID.
                </p>
              </div>

              <Button
                size="sm"
                onClick={() => setIsAddProfileModalOpen(true)}
                className="gap-1.5 text-xs font-semibold shadow-sm"
              >
                <UserPlus className="h-4 w-4" /> Add New Profile
              </Button>
            </div>

            <DirectoryAdminTable
              profiles={profiles}
              sessions={sessions}
              isAdmin={true}
            />
          </motion.div>
        )}

        {/* Tab 5: Academic Batches */}
        {activeTab === 'batches' && (
          <motion.div
            key="batches"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.16 }}
            className="space-y-4"
          >
            <div className="p-5 bg-card rounded-3xl border border-border/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-bold text-foreground">
                    Academic Batches & Sessions
                  </h2>
                  <Badge variant="outline" className="text-xs gap-1 border-border">
                    <Building2 className="h-3 w-3" /> {sessions.length} Configured Batches
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Total 15 Batches: Active (CSE 11–15) for Current Students & CSE 01–10 for Graduated Alumni.
                </p>
              </div>

              <Button
                size="sm"
                onClick={() => setIsSessionModalOpen(true)}
                className="gap-1.5 text-xs font-semibold shadow-sm"
              >
                <FolderPlus className="h-4 w-4" /> Add New Batch
              </Button>
            </div>

            {/* Batches Grid Display */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sessions.map((batch) => {
                const isActiveBatch = batch.sort_order >= 11 && batch.sort_order <= 15;
                const profileCountInBatch = profiles.filter((p) => p.session_id === batch.id).length;

                return (
                  <Card key={batch.id} className="bg-card border-border/80 hover:border-primary/40 transition-colors rounded-2xl">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'flex h-10 w-10 items-center justify-center rounded-xl font-bold text-xs',
                            isActiveBatch
                              ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30'
                              : 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30'
                          )}
                        >
                          {batch.sort_order}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-foreground">{batch.label}</h4>
                          <p className="text-[11px] text-muted-foreground">
                            {profileCountInBatch} profiles registered
                          </p>
                        </div>
                      </div>

                      <span
                        className={cn(
                          'text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border',
                          isActiveBatch
                            ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/20'
                            : 'bg-muted text-muted-foreground border-border'
                        )}
                      >
                        {isActiveBatch ? 'Active' : 'Alumni'}
                      </span>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Add Session Modal */}
      {isSessionModalOpen && (
        <AddSessionDialog
          isOpen={true}
          onClose={() => setIsSessionModalOpen(false)}
        />
      )}

      {/* Add Profile Modal */}
      {isAddProfileModalOpen && (
        <ProfileFormDialog
          isOpen={true}
          onClose={() => setIsAddProfileModalOpen(false)}
          sessions={sessions}
          defaultType="student"
          isAdmin={true}
        />
      )}

    </div>
  );
}
