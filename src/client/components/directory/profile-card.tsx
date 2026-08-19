import Link from 'next/link';
import { Card, CardContent } from '@/client/components/ui/card';
import { Badge } from '@/client/components/ui/badge';
import { Avatar } from '@/client/components/ui/avatar';
import { Briefcase, MapPin, ArrowRight, Phone, Linkedin, Facebook } from 'lucide-react';
import type { ProfileRecord } from '@/server/db/schema.types';
import { formatRoll } from '@/client/lib/utils';

interface ProfileCardProps {
  profile: ProfileRecord;
}

export function ProfileCard({ profile }: ProfileCardProps) {
  const isStudent = profile.profile_type === 'student';

  return (
    <Card className="overflow-hidden hover:border-primary/50 hover:shadow-md transition-all duration-200 flex flex-col h-full bg-card group">
      <CardContent className="p-5 flex flex-col flex-1">
        
        {/* Top Header: Avatar + Identity + Badge */}
        <div className="flex items-start gap-4 mb-4">
          <Avatar
            src={profile.avatar_url}
            fallbackText={profile.full_name}
            size="lg"
            className="border-2 border-background ring-1 ring-border"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <Badge variant={isStudent ? 'student' : 'alumni'} className="text-[10px] uppercase">
                {isStudent ? 'Active Student' : 'Alumni'}
              </Badge>
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
              <span>ID: <strong className="font-medium text-foreground">{profile.student_id}</strong></span>
              <span>•</span>
              <span>Roll: <strong className="font-medium text-foreground">{formatRoll(profile.roll_number)}</strong></span>
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

        {/* Location info */}
        {(profile.current_city || profile.home_district) && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">
              {profile.current_city ? profile.current_city : `District: ${profile.home_district}`}
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
