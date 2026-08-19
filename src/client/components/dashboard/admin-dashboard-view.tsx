'use client';

import * as React from 'react';
import { Card, CardContent } from '@/client/components/ui/card';
import { Button } from '@/client/components/ui/button';
import { Badge } from '@/client/components/ui/badge';
import { Tabs } from '@/client/components/ui/tabs';
import { PendingUsersTable } from './pending-users-table';
import { ApprovedUsersTable } from './approved-users-table';
import { DirectoryAdminTable } from './directory-admin-table';
import { AddSessionDialog } from './add-session-dialog';
import { logoutAction } from '@/server/actions/auth.actions';
import type { ProfileRecord, SessionRecord, UserProfileRecord } from '@/server/db/schema.types';
import { Shield, LogOut, UserCheck, Users, FolderPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
  const [activeTab, setActiveTab] = React.useState<string>('pending');
  const [isSessionModalOpen, setIsSessionModalOpen] = React.useState(false);

  const handleLogout = async () => {
    await logoutAction();
    router.push('/login');
  };

  const tabs = [
    {
      id: 'pending',
      label: 'Pending Approvals',
      count: pendingUsers.length,
      icon: UserCheck,
    },
    {
      id: 'users',
      label: 'Approved Members',
      count: approvedUsers.length,
      icon: Users,
    },
    {
      id: 'directory',
      label: 'Directory Management',
      count: profiles.length,
      icon: Shield,
    },
  ];

  return (
    <div className="space-y-8">
      
      {/* Admin Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-card rounded-2xl border border-border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg shadow-sm">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">{adminUser.name}</h1>
              <Badge variant="default" className="text-xs gap-1">
                <Shield className="h-3 w-3" /> System Administrator
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Email: {adminUser.email} • ID: {adminUser.student_id}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsSessionModalOpen(true)}
            className="gap-1.5 text-xs font-semibold"
          >
            <FolderPlus className="h-4 w-4" /> Add Batch
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="gap-1.5 text-xs text-muted-foreground hover:text-destructive"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="space-y-6">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        {/* Tab 1: Pending Approvals */}
        {activeTab === 'pending' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-foreground">User Registration Approvals</h3>
                <p className="text-xs text-muted-foreground">
                  Review and approve new member registrations. Rejected registrations will be permanently deleted.
                </p>
              </div>
            </div>
            <PendingUsersTable pendingUsers={pendingUsers} />
          </div>
        )}

        {/* Tab 2: Approved Users */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-foreground">Approved Department Members</h3>
                <p className="text-xs text-muted-foreground">
                  View and manage access permissions for approved departmental users.
                </p>
              </div>
            </div>
            <ApprovedUsersTable approvedUsers={approvedUsers} />
          </div>
        )}

        {/* Tab 3: Directory Management */}
        {activeTab === 'directory' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-foreground">Student & Alumni Records</h3>
                <p className="text-xs text-muted-foreground">
                  Full management access: Add, update any profile, or delete records.
                </p>
              </div>
            </div>
            <DirectoryAdminTable
              profiles={profiles}
              sessions={sessions}
              isAdmin={true}
            />
          </div>
        )}
      </div>

      {/* Add Session Modal */}
      {isSessionModalOpen && (
        <AddSessionDialog
          isOpen={true}
          onClose={() => setIsSessionModalOpen(false)}
        />
      )}

    </div>
  );
}
