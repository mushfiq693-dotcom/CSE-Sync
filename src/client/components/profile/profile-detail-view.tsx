'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/client/components/ui/card';
import { Badge } from '@/client/components/ui/badge';
import { Avatar } from '@/client/components/ui/avatar';
import { Button } from '@/client/components/ui/button';
import { FadeIn } from '@/client/components/animations/motion-wrapper';
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  GraduationCap,
  Phone,
  Linkedin,
  Instagram,
  Facebook,
  Building,
  School,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import type { ProfileRecord } from '@/server/db/schema.types';

interface ProfileDetailViewProps {
  profile: ProfileRecord;
}

export function ProfileDetailView({ profile }: ProfileDetailViewProps) {
  const isStudent = profile.profile_type === 'student';

  const hasContactInfo = profile.phone || profile.facebook_url || profile.instagram_url || profile.linkedin_url;
  const hasCareerInfo = profile.workplace || profile.workplace_details || profile.job_status !== 'unemployed';
  const hasLocationInfo = profile.home_district || profile.hometown || profile.current_city;
  const hasEducationInfo = profile.school || profile.college;

  const creatorName = profile.creator?.name || 'Authorized Member';
  const updaterName = profile.updater?.name || creatorName;
  const hasBeenUpdated = profile.created_at !== profile.updated_at && profile.updated_by !== profile.created_by;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* Back to Directory Navigation */}
      <FadeIn>
        <Link href={isStudent ? '/students' : '/alumni'}>
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to {isStudent ? 'Current Students' : 'Alumni Directory'}
          </Button>
        </Link>
      </FadeIn>

      {/* Main Identity Banner Card */}
      <FadeIn delay={0.05}>
        <Card className="border border-border/80 bg-gradient-to-b from-card to-muted/20 shadow-sm overflow-hidden">
          <div className="h-28 bg-gradient-to-r from-primary/90 to-primary/70" />
          <CardContent className="px-6 pb-6 pt-0 relative">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-14 mb-4">
              <Avatar
                src={profile.avatar_url}
                fallbackText={profile.full_name}
                size="xl"
                className="border-4 border-card ring-2 ring-border/50 shadow-md bg-card"
              />
              <div className="flex items-center gap-2">
                <Badge variant={isStudent ? 'student' : 'alumni'} className="text-xs uppercase px-3 py-1">
                  {isStudent ? 'ACTIVE STUDENT' : 'ALUMNI'}
                </Badge>
                {profile.session?.label && (
                  <span className="text-sm font-bold bg-background border border-border px-3 py-1 rounded-full text-foreground shadow-sm">
                    {profile.session.label}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                {profile.full_name}
              </h1>
              <p className="text-sm text-muted-foreground font-medium">
                Department of Computer Science and Engineering, GSTU
              </p>
            </div>

            {/* Identity Quick Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-border/70">
              <div className="bg-background/80 p-3 rounded-lg border border-border/50">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase">Student ID</span>
                <p className="text-base font-bold text-foreground mt-0.5">{profile.student_id}</p>
              </div>
              <div className="bg-background/80 p-3 rounded-lg border border-border/50">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase">Batch / Session</span>
                <p className="text-base font-bold text-foreground mt-0.5">{profile.session?.label || 'N/A'}</p>
              </div>
              <div className="bg-background/80 p-3 rounded-lg border border-border/50">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase">Job Status</span>
                <p className="text-base font-bold text-foreground mt-0.5 capitalize">{profile.job_status.replace('_', ' ')}</p>
              </div>
            </div>

          </CardContent>
        </Card>
      </FadeIn>

      {/* Detail Sections Grid */}
      <FadeIn delay={0.1} className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* 1. Career Information */}
        {hasCareerInfo && (
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-foreground">
                <Briefcase className="h-4 w-4 text-primary" /> Career & Employment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between py-1.5 border-b border-border/60">
                <span className="text-muted-foreground">Current Status</span>
                <span className="font-semibold text-foreground capitalize">{profile.job_status.replace('_', ' ')}</span>
              </div>
              {profile.workplace && (
                <div className="flex justify-between py-1.5 border-b border-border/60">
                  <span className="text-muted-foreground">Workplace / Employer</span>
                  <span className="font-semibold text-foreground text-right">{profile.workplace}</span>
                </div>
              )}
              {profile.workplace_details && (
                <div className="py-1.5">
                  <span className="text-muted-foreground block text-xs mb-1">Details / Position</span>
                  <p className="text-foreground bg-muted/40 p-2.5 rounded-md text-xs leading-relaxed">
                    {profile.workplace_details}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* 2. Contact & Social Profiles */}
        {hasContactInfo && (
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-foreground">
                <Phone className="h-4 w-4 text-primary" /> Contact & Social Profiles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {profile.phone && (
                <div className="flex items-center justify-between py-1.5 border-b border-border/60">
                  <span className="text-muted-foreground">Phone Number</span>
                  <a href={`tel:${profile.phone}`} className="font-semibold text-primary hover:underline">
                    {profile.phone}
                  </a>
                </div>
              )}
              {profile.linkedin_url && (
                <div className="flex items-center justify-between py-1.5 border-b border-border/60">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Linkedin className="h-3.5 w-3.5 text-[#0A66C2]" /> LinkedIn
                  </span>
                  <a
                    href={profile.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-primary hover:underline text-xs truncate max-w-[200px]"
                  >
                    View LinkedIn Profile
                  </a>
                </div>
              )}
              {profile.facebook_url && (
                <div className="flex items-center justify-between py-1.5 border-b border-border/60">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Facebook className="h-3.5 w-3.5 text-[#1877F2]" /> Facebook
                  </span>
                  <a
                    href={profile.facebook_url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-primary hover:underline text-xs truncate max-w-[200px]"
                  >
                    View Facebook Profile
                  </a>
                </div>
              )}
              {profile.instagram_url && (
                <div className="flex items-center justify-between py-1.5 border-b border-border/60">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Instagram className="h-3.5 w-3.5 text-[#E4405F]" /> Instagram
                  </span>
                  <a
                    href={profile.instagram_url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-primary hover:underline text-xs truncate max-w-[200px]"
                  >
                    View Instagram Profile
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* 3. Location Information */}
        {hasLocationInfo && (
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-foreground">
                <MapPin className="h-4 w-4 text-primary" /> Location & Residence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {profile.home_district && (
                <div className="flex justify-between py-1.5 border-b border-border/60">
                  <span className="text-muted-foreground">Home District</span>
                  <span className="font-semibold text-foreground">{profile.home_district}</span>
                </div>
              )}
              {profile.hometown && (
                <div className="flex justify-between py-1.5 border-b border-border/60">
                  <span className="text-muted-foreground">Hometown / Origin</span>
                  <span className="font-semibold text-foreground">{profile.hometown}</span>
                </div>
              )}
              {profile.current_city && (
                <div className="flex justify-between py-1.5 border-b border-border/60">
                  <span className="text-muted-foreground">Current City</span>
                  <span className="font-semibold text-foreground">{profile.current_city}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* 4. Pre-University Education */}
        {hasEducationInfo && (
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-foreground">
                <GraduationCap className="h-4 w-4 text-primary" /> Educational Background
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {profile.college && (
                <div className="flex items-start justify-between py-1.5 border-b border-border/60">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Building className="h-3.5 w-3.5" /> College (HSC)
                  </span>
                  <span className="font-semibold text-foreground text-right">{profile.college}</span>
                </div>
              )}
              {profile.school && (
                <div className="flex items-start justify-between py-1.5 border-b border-border/60">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <School className="h-3.5 w-3.5" /> School (SSC)
                  </span>
                  <span className="font-semibold text-foreground text-right">{profile.school}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

      </FadeIn>

      {/* Departmental Audit Footnote (Strictly per requirements) */}
      <FadeIn delay={0.15} className="mt-8 pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-2">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          <span>Created by: <strong className="font-medium text-foreground">{creatorName}</strong></span>
        </div>
        {hasBeenUpdated && (
          <div className="flex items-center gap-1.5">
            <UserCheck className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Updated by: <strong className="font-medium text-foreground">{updaterName}</strong></span>
          </div>
        )}
      </FadeIn>

    </div>
  );
}
