'use client';

import * as React from 'react';
import { Badge } from '@/client/components/ui/badge';
import { Button } from '@/client/components/ui/button';
import { updateUserRoleAction } from '@/server/actions/admin.actions';
import type { UserProfileRecord, UserRole } from '@/server/db/schema.types';
import { Shield, User, Loader2 } from 'lucide-react';
import { isBatch15 } from '@/client/lib/utils';

interface ApprovedUsersTableProps {
  approvedUsers: UserProfileRecord[];
}

export function ApprovedUsersTable({ approvedUsers }: ApprovedUsersTableProps) {
  const [loadingId, setLoadingId] = React.useState<string | null>(null);

  const handleToggleRole = async (user: UserProfileRecord) => {
    const nextRole: UserRole = user.role === 'admin' ? 'approved_user' : 'admin';
    if (!confirm(`Change role for ${user.name} to ${nextRole === 'admin' ? 'Admin' : 'Approved User'}?`)) {
      return;
    }
    setLoadingId(user.id);
    try {
      await updateUserRoleAction(user.id, nextRole);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border bg-muted/40 text-xs font-bold uppercase text-muted-foreground">
          <tr>
            <th className="px-4 py-3">Member Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Student ID</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3 text-right">Role Management</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {approvedUsers.map((user) => {
            const isLoading = loadingId === user.id;
            const isAdmin = user.role === 'admin';
            const isBatch15User = isBatch15(user.student_id);

            return (
              <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3 font-semibold text-foreground">{user.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                <td className="px-4 py-3 font-medium text-foreground">
                  <div className="flex items-center gap-1.5">
                    <span>{user.student_id}</span>
                    {isBatch15User && (
                      <Badge variant="outline" className="text-[10px] bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30 font-bold">
                        Batch 15
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={isAdmin ? 'default' : isBatch15User ? 'outline' : 'secondary'} className="gap-1 text-xs">
                    {isAdmin ? <Shield className="h-3 w-3" /> : <User className="h-3 w-3" />}
                    {isAdmin ? 'Admin' : isBatch15User ? 'Member (View Only)' : 'Approved Member'}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleRole(user)}
                    disabled={isLoading}
                    className="h-8 text-xs font-medium"
                  >
                    {isLoading ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : isAdmin ? (
                      'Demote to User'
                    ) : (
                      'Promote to Admin'
                    )}
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
