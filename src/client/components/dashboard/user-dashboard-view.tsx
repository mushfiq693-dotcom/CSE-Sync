'use client';

import * as React from 'react';
import { Card, CardContent } from '@/client/components/ui/card';
import { Button } from '@/client/components/ui/button';
import { Badge } from '@/client/components/ui/badge';
import { DirectoryAdminTable } from './directory-admin-table';
import { logoutAction } from '@/server/actions/auth.actions';
import type { ProfileRecord, SessionRecord, UserProfileRecord } from '@/server/db/schema.types';
import { User, LogOut, ShieldCheck, Plus, Sparkles, Lock, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { isBatch15 } from '@/client/lib/utils';

interface UserDashboardViewProps {
  user: UserProfileRecord;
  profiles: ProfileRecord[];
  sessions: SessionRecord[];
}

export function UserDashboardView({ user, profiles, sessions }: UserDashboardViewProps) {
  const router = useRouter();
  const isBatch15Restricted = user.role !== 'admin' && isBatch15(user.student_id);

  const handleLogout = async () => {
    await logoutAction();
    router.push('/login');
  };

  return (
    <div className="space-y-8">
      
      {/* Top Welcome & Account Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-card rounded-2xl border border-border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-lg">
            <User className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">{user.name}</h1>
              {isBatch15Restricted ? (
                <Badge variant="outline" className="gap-1 text-xs bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/30">
                  <Eye className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                  Batch 15 • View-Only Member
                </Badge>
              ) : (
                <Badge variant="secondary" className="gap-1 text-xs">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  Approved Member
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              ID: <strong className="font-semibold text-foreground">{user.student_id}</strong> • Email: {user.email}
            </p>
          </div>
        </div>

        <div>
          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-1.5 text-xs text-muted-foreground hover:text-destructive">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Info Card: Batch 15 Privacy Notice vs Shared Edit Banner */}
      {isBatch15Restricted ? (
        <div className="p-4 bg-amber-500/10 dark:bg-amber-950/30 rounded-xl border border-amber-500/25 flex items-start gap-3">
          <Lock className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-foreground/90 leading-relaxed space-y-1">
            <p className="font-bold text-amber-900 dark:text-amber-200">
              Batch 15 Directory Privacy &amp; Access Mode
            </p>
            <p className="text-muted-foreground">
              Welcome Batch 15! You have full access to explore, search, and view all student and alumni profiles across the GSTU CSE Directory. To ensure data privacy and maintain directory accuracy, profile editing permissions are reserved for senior batches and department administrators.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-primary/5 rounded-xl border border-primary/15 flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="text-xs text-foreground/80 leading-relaxed">
            <strong>Shared Departmental Edit Access:</strong> As an approved member, you can add new profiles or update any student and alumni profiles to ensure departmental accuracy. The update history records your name as the latest editor.
          </div>
        </div>
      )}

      {/* Directory Management Table */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-foreground">Directory Management</h2>
        <DirectoryAdminTable
          profiles={profiles}
          sessions={sessions}
          isAdmin={false}
          canEdit={!isBatch15Restricted}
        />
      </div>

    </div>
  );
}
