'use client';

import * as React from 'react';
import { ProfileCard } from './profile-card';
import { Input } from '@/client/components/ui/input';
import { Button } from '@/client/components/ui/button';
import { Search, Filter, ArrowDown01, Users, X } from 'lucide-react';
import { StaggerContainer, StaggerItem, FadeIn } from '@/client/components/animations/motion-wrapper';
import type { ProfileRecord, SessionRecord } from '@/server/db/schema.types';

interface DirectoryViewProps {
  initialProfiles: ProfileRecord[];
  sessions: SessionRecord[];
  type: 'student' | 'alumni';
  title: string;
  subtitle: string;
}

export function DirectoryView({
  initialProfiles,
  sessions,
  type,
  title,
  subtitle,
}: DirectoryViewProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedSession, setSelectedSession] = React.useState<string>('all');

  // Filter profiles based on search term and session
  const filteredProfiles = React.useMemo(() => {
    return initialProfiles.filter((p) => {
      // 1. Session Filter
      if (selectedSession !== 'all' && p.session_id !== selectedSession) {
        return false;
      }

      // 2. Search Filter (Name, Student ID, or Home District)
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase().trim();
        const matchesName = p.full_name.toLowerCase().includes(query);
        const matchesId = p.student_id.toLowerCase().includes(query);
        const matchesDistrict = p.home_district?.toLowerCase().includes(query) || false;
        return matchesName || matchesId || matchesDistrict;
      }

      return true;
    }).sort((a, b) => a.student_id.localeCompare(b.student_id, undefined, { numeric: true }));
  }, [initialProfiles, selectedSession, searchTerm]);

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <FadeIn className="border-b border-border/80 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-base text-muted-foreground max-w-3xl">
          {subtitle}
        </p>
      </FadeIn>

      {/* Filter & Search Bar */}
      <FadeIn delay={0.05} className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-card p-4 rounded-xl border border-border shadow-sm">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name, student ID, or home district..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-8"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Session Filter Dropdown / Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap flex items-center gap-1">
            <Filter className="h-3.5 w-3.5" /> Batch:
          </span>
          <select
            value={selectedSession}
            onChange={(e) => setSelectedSession(e.target.value)}
            aria-label="Filter by Batch / Session"
            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-medium"
          >
            <option value="all">
              {type === 'student' ? 'All Active Batches (CSE 11–15)' : 'All Alumni Batches (CSE 01–10)'}
            </option>
            {sessions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

      </FadeIn>

      {/* Result Count & Sorting Indicator */}
      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
        <span className="font-medium flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5 text-primary" />
          Showing <strong className="text-foreground">{filteredProfiles.length}</strong> {type === 'student' ? 'students' : 'alumni'}
        </span>
        <span className="flex items-center gap-1 font-medium">
          <ArrowDown01 className="h-3.5 w-3.5 text-primary" /> Sorted by Student ID
        </span>
      </div>

      {/* Profiles Grid with Stagger Animation */}
      {filteredProfiles.length > 0 ? (
        <StaggerContainer
          key={`${selectedSession}-${searchTerm}`}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {filteredProfiles.map((profile) => (
            <StaggerItem key={profile.id}>
              <ProfileCard profile={profile} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      ) : (
        <FadeIn className="text-center py-16 px-4 rounded-xl border border-dashed border-border bg-muted/20">
          <Users className="mx-auto h-12 w-12 text-muted-foreground/40 mb-3" />
          <h3 className="text-lg font-semibold text-foreground">No profiles found</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
            We couldn't find any {type === 'student' ? 'students' : 'alumni'} matching your search criteria.
          </p>
          {(searchTerm || selectedSession !== 'all') && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setSelectedSession('all');
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          )}
        </FadeIn>
      )}

    </div>
  );
}
