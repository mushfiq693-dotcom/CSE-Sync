'use client';

import * as React from 'react';
import { Button } from '@/client/components/ui/button';
import { approveUserAction, rejectUserAction } from '@/server/actions/admin.actions';
import type { UserProfileRecord } from '@/server/db/schema.types';
import { Check, X, Loader2, UserCheck, AlertTriangle } from 'lucide-react';

interface PendingUsersTableProps {
  pendingUsers: UserProfileRecord[];
}

export function PendingUsersTable({ pendingUsers }: PendingUsersTableProps) {
  const [loadingId, setLoadingId] = React.useState<string | null>(null);

  const handleApprove = async (userId: string) => {
    setLoadingId(userId);
    try {
      await approveUserAction(userId);
    } finally {
      setLoadingId(null);
    }
  };

  const handleReject = async (userId: string, name: string) => {
    if (!confirm(`Are you sure you want to reject and remove registration for ${name}?`)) {
      return;
    }
    setLoadingId(userId);
    try {
      await rejectUserAction(userId);
    } finally {
      setLoadingId(null);
    }
  };

  if (pendingUsers.length === 0) {
    return (
      <div className="text-center py-12 px-4 rounded-xl border border-dashed border-border bg-card">
        <UserCheck className="mx-auto h-10 w-10 text-muted-foreground/40 mb-2" />
        <h3 className="text-base font-semibold text-foreground">No Pending Registrations</h3>
        <p className="text-xs text-muted-foreground mt-1">
          All submitted user registrations have been reviewed.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border bg-muted/40 text-xs font-bold uppercase text-muted-foreground">
          <tr>
            <th className="px-4 py-3">Applicant Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Student ID</th>
            <th className="px-4 py-3">Registered At</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {pendingUsers.map((user) => {
            const isLoading = loadingId === user.id;
            return (
              <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3 font-semibold text-foreground">{user.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                <td className="px-4 py-3 font-medium text-foreground">{user.student_id}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {new Date(user.created_at).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleApprove(user.id)}
                      disabled={isLoading}
                      className="h-8 gap-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleReject(user.id, user.name)}
                      disabled={isLoading}
                      className="h-8 gap-1"
                    >
                      <X className="h-3.5 w-3.5" />
                      Reject
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
