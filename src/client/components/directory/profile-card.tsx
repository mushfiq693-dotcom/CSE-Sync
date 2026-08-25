import Link from 'next/link';
import { Card, CardContent } from '@/client/components/ui/card';
import { Badge } from '@/client/components/ui/badge';
import { Avatar } from '@/client/components/ui/avatar';
import { Briefcase, MapPin, ArrowRight, Phone, Linkedin, Facebook, Crown, Award } from 'lucide-react';
import type { ProfileRecord } from '@/server/db/schema.types';
import { cn } from '@/client/lib/utils';

interface ProfileCardProps {
  profile: ProfileRecord;
}

export function ProfileCard({ profile }: ProfileCardProps) {
  const isStudent = profile.profile_type === 'student';
  const isCR = profile.leadership_role === 'CR';
  const isACR = profile.leadership_role === 'ACR';
  const isRank1 = profile.academic_rank === '1st';
  const isRank2 = profile.academic_rank === '2nd';
  const isRank3 = profile.academic_rank === '3rd';
  const hasRank = isRank1 || isRank2 || isRank3;

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-200 flex flex-col h-full bg-card group relative",
      isRank1 && "border-amber-400/80 dark:border-amber-400/60 shadow-md ring-2 ring-amber-400/30 hover:border-amber-500 hover:ring-amber-400/50 hover:shadow-lg",
      isRank2 && "border-slate-400/80 dark:border-slate-400/60 shadow-md ring-2 ring-slate-400/30 hover:border-slate-500 hover:ring-slate-400/50 hover:shadow-lg",
      isRank3 && "border-orange-500/80 dark:border-orange-500/60 shadow-md ring-2 ring-orange-500/30 hover:border-orange-600 hover:ring-orange-500/50 hover:shadow-lg",
      !hasRank && isCR && "border-amber-500/40 dark:border-amber-500/30 shadow-xs ring-1 ring-amber-500/20 hover:border-amber-500/60 hover:shadow-sm",
      !hasRank && isACR && "border-blue-500/40 dark:border-blue-500/30 shadow-xs ring-1 ring-blue-500/20 hover:border-blue-500/60 hover:shadow-sm",
      !hasRank && !isCR && !isACR && "hover:border-primary/50 hover:shadow-md"
    )}>
      {/* 1st, 2nd, 3rd Supreme Academic Merit Banners (Highest Visual Prominence) */}
      {isRank1 && (
        <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-amber-950 font-black text-[11px] uppercase tracking-wide px-3.5 py-1 flex items-center justify-between shadow-sm border-b border-amber-400/40">
          <span className="flex items-center gap-1.5 drop-shadow-xs">
            <span className="text-xs">🥇</span> 1st Position (Academic Merit)
          </span>
          <span className="text-[10px] font-extrabold bg-amber-950/15 text-amber-950 px-2 py-0.5 rounded-full uppercase tracking-wider">
            {isCR ? '👑 1st • CR' : isACR ? '🎖️ 1st • ACR' : 'Top Ranker'}
          </span>
        </div>
      )}
      {isRank2 && (
        <div className="bg-gradient-to-r from-slate-600 via-slate-500 to-zinc-600 text-white font-black text-[11px] uppercase tracking-wide px-3.5 py-1 flex items-center justify-between shadow-sm border-b border-slate-400/30">
          <span className="flex items-center gap-1.5 drop-shadow-xs">
            <span className="text-xs">🥈</span> 2nd Position (Academic Merit)
          </span>
          <span className="text-[10px] font-extrabold bg-white/20 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
            {isCR ? '👑 2nd • CR' : isACR ? '🎖️ 2nd • ACR' : '2nd Merit'}
          </span>
        </div>
      )}
      {isRank3 && (
        <div className="bg-gradient-to-r from-amber-800 via-orange-700 to-amber-900 text-amber-100 font-black text-[11px] uppercase tracking-wide px-3.5 py-1 flex items-center justify-between shadow-sm border-b border-orange-600/30">
          <span className="flex items-center gap-1.5 drop-shadow-xs">
            <span className="text-xs">🥉</span> 3rd Position (Academic Merit)
          </span>
          <span className="text-[10px] font-extrabold bg-black/25 text-amber-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
            {isCR ? '👑 3rd • CR' : isACR ? '🎖️ 3rd • ACR' : '3rd Merit'}
          </span>
        </div>
      )}

      {/* Leadership Pinned Ribbon (When not already shown in Merit Banner) */}
      {!hasRank && isCR && (
        <div className="bg-gradient-to-r from-amber-600/90 to-amber-700/90 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 flex items-center justify-between shadow-xs">
          <span className="flex items-center gap-1">
            <Crown className="h-3 w-3" /> Class Representative (CR)
          </span>
          <span className="opacity-80 text-[9px]">Leadership</span>
        </div>
      )}
      {!hasRank && isACR && (
        <div className="bg-gradient-to-r from-blue-700/90 to-indigo-700/90 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 flex items-center justify-between shadow-xs">
          <span className="flex items-center gap-1">
            <Award className="h-3 w-3" /> Assistant CR (ACR)
          </span>
          <span className="opacity-80 text-[9px]">Leadership</span>
        </div>
      )}

      <CardContent className="p-5 flex flex-col flex-1">
        
        {/* Top Header: Avatar + Identity + Badge */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <Avatar
              src={profile.avatar_url}
              fallbackText={profile.full_name}
              size="lg"
              className={cn(
                "border-2 border-background ring-2",
                isRank1 ? "ring-amber-400 shadow-xs" :
                isRank2 ? "ring-slate-400 shadow-xs" :
                isRank3 ? "ring-orange-500 shadow-xs" :
                isCR ? "ring-amber-500/70" :
                isACR ? "ring-blue-500/70" :
                "ring-border"
              )}
            />
            {isRank1 && (
              <span className="absolute -bottom-1 -right-1 bg-amber-500 text-amber-950 p-0.5 rounded-full shadow-sm font-bold text-[10px] leading-none flex items-center justify-center h-4 w-4">
                👑
              </span>
            )}
            {!isRank1 && isRank2 && (
              <span className="absolute -bottom-1 -right-1 bg-slate-400 text-white p-0.5 rounded-full shadow-sm font-bold text-[10px] leading-none flex items-center justify-center h-4 w-4">
                🥈
              </span>
            )}
            {!isRank1 && !isRank2 && isRank3 && (
              <span className="absolute -bottom-1 -right-1 bg-orange-600 text-white p-0.5 rounded-full shadow-sm font-bold text-[10px] leading-none flex items-center justify-center h-4 w-4">
                🥉
              </span>
            )}
            {!hasRank && isCR && (
              <span className="absolute -bottom-1 -right-1 bg-amber-500 text-white p-0.5 rounded-full shadow-sm">
                <Crown className="h-3 w-3" />
              </span>
            )}
            {!hasRank && isACR && (
              <span className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-0.5 rounded-full shadow-sm">
                <Award className="h-3 w-3" />
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1">
              <div className="flex items-center gap-1.5">
                <Badge variant={isStudent ? 'student' : 'alumni'} className="text-[10px] uppercase">
                  {isStudent ? 'Active Student' : 'Alumni'}
                </Badge>
                {isCR && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                    <Crown className="h-2.5 w-2.5" /> CR
                  </span>
                )}
                {isACR && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30">
                    <Award className="h-2.5 w-2.5" /> ACR
                  </span>
                )}
              </div>
              {profile.session?.label && (
                <span className="text-xs font-semibold text-muted-foreground bg-muted/60 px-2 py-0.5 rounded">
                  {profile.session.label}
                </span>
              )}
            </div>
            
            <h3 className="font-bold text-base text-foreground truncate group-hover:text-primary transition-colors">
              {profile.full_name}
            </h3>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
              <span>Student ID: <strong className="font-medium text-foreground">{profile.student_id}</strong></span>
            </div>
          </div>
        </div>

        {/* Career & Workplace info */}
        {profile.workplace && (
          <div className="flex items-center gap-1.5 text-xs text-foreground/80 mb-2 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-md">
            <Briefcase className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="truncate">{profile.workplace}</span>
          </div>
        )}

        {/* Home District Location Info */}
        {(profile.home_district || profile.hometown || profile.current_city) && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">
              {profile.home_district || profile.hometown || profile.current_city}
            </span>
          </div>
        )}

        {/* Bottom CTA & Quick Links */}
        <div className="mt-auto pt-3 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            {profile.linkedin_url && (
              <a
                href={profile.linkedin_url}
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors p-1"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-3.5 w-3.5" />
              </a>
            )}
            {profile.facebook_url && (
              <a
                href={profile.facebook_url}
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors p-1"
                aria-label="Facebook"
              >
                <Facebook className="h-3.5 w-3.5" />
              </a>
            )}
            {profile.phone && (
              <a
                href={`tel:${profile.phone}`}
                className="text-muted-foreground hover:text-primary transition-colors p-1"
                aria-label="Phone"
              >
                <Phone className="h-3.5 w-3.5" />
              </a>
            )}
          </div>

          <Link
            href={`/profile/${profile.id}`}
            prefetch={true}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            View Details
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

      </CardContent>
    </Card>
  );
}
