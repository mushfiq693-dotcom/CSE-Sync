'use client';

import * as React from 'react';
import { Badge } from '@/client/components/ui/badge';
import { Button } from '@/client/components/ui/button';
import { Input } from '@/client/components/ui/input';
import { deleteProfileAction } from '@/server/actions/profile.actions';
import { ProfileFormDialog } from './profile-form-dialog';
import type { ProfileRecord, SessionRecord } from '@/server/db/schema.types';
import { Search, Edit3, Trash2, Loader2, Plus } from 'lucide-react';

interface DirectoryAdminTableProps {
  profiles: ProfileRecord[];
  sessions: SessionRecord[];
  isAdmin: boolean;
}

export function DirectoryAdminTable({ profiles, sessions, isAdmin }: DirectoryAdminTableProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedSession, setSelectedSession] = React.useState<string>('all');
  const [editingProfile, setEditingProfile] = React.useState<ProfileRecord | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [createType, setCreateType] = React.useState<'student' | 'alumni'>('student');
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const filteredProfiles = React.useMemo(() => {
    return profiles.filter((p) => {
      if (selectedSession !== 'all' && p.session_id !== selectedSession) {
        return false;
      }
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase().trim();
        const matchesName = p.full_name.toLowerCase().includes(query);
        const matchesId = p.student_id.toLowerCase().includes(query);
        return matchesName || matchesId;
      }
      return true;
    }).sort((a, b) => a.student_id.localeCompare(b.student_id, undefined, { numeric: true }));
  }, [profiles, selectedSession, searchTerm]);

  const handleDelete = async (profileId: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete profile of ${name}?`)) {
      return;
    }
    setDeletingId(profileId);
    try {
      await deleteProfileAction(profileId);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Top Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search directory by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <select
            value={selectedSession}
            onChange={(e) => setSelectedSession(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-xs font-semibold shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="all">All Batches (15)</option>
            {sessions.some((s) => s.sort_order >= 11 && s.sort_order <= 15) ? (
              <>
                <optgroup label="Active Batches (CSE 11–15)">
                  {sessions.filter((s) => s.sort_order >= 11 && s.sort_order <= 15).map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label} (Active)
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Alumni Batches (CSE 01–10)">
                  {sessions.filter((s) => s.sort_order >= 1 && s.sort_order <= 10).map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label} (Alumni)
                    </option>
                  ))}
                </optgroup>
              </>
            ) : (
              sessions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => {
              setCreateType('student');
              setIsCreateModalOpen(true);
            }}
            className="gap-1.5 font-semibold shadow-sm text-xs"
          >
            <Plus className="h-3.5 w-3.5" /> Add Student
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setCreateType('alumni');
              setIsCreateModalOpen(true);
            }}
            className="gap-1.5 font-semibold text-xs border-border"
          >
            <Plus className="h-3.5 w-3.5" /> Add Alumni
          </Button>
        </div>
      </div>

      {/* Directory Records Table */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/40 text-xs font-bold uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Student ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Batch</th>
              <th className="px-4 py-3">Workplace</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredProfiles.length > 0 ? (
              filteredProfiles.map((p) => {
                const isStudent = p.profile_type === 'student';
                const isDeleting = deletingId === p.id;
                return (
                  <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-bold text-primary">{p.student_id}</td>
                    <td className="px-4 py-3 font-semibold text-foreground">{p.full_name}</td>
                    <td className="px-4 py-3">
                      <Badge variant={isStudent ? 'student' : 'alumni'} className="text-[10px] uppercase">
                        {isStudent ? 'Student' : 'Alumni'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs font-medium text-muted-foreground">
                      {p.session?.label || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground truncate max-w-[150px]">
                      {p.workplace || '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {/* Shared Edit Button: Accessible to both Admin & Approved Users */}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingProfile(p)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                          title="Edit Profile (Shared Edit)"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>

                        {/* Admin-only Delete Button */}
                        {isAdmin && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(p.id, p.full_name)}
                            disabled={isDeleting}
                            className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                            title="Delete Profile (Admin Only)"
                          >
                            {isDeleting ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-xs text-muted-foreground">
                  No directory profiles matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Profile Modal */}
      {editingProfile && (
        <ProfileFormDialog
          isOpen={true}
          onClose={() => setEditingProfile(null)}
          sessions={sessions}
          initialData={editingProfile}
        />
      )}

      {/* Create Profile Modal */}
      {isCreateModalOpen && (
        <ProfileFormDialog
          isOpen={true}
          onClose={() => setIsCreateModalOpen(false)}
          sessions={sessions}
          defaultType={createType}
        />
      )}

    </div>
  );
}
