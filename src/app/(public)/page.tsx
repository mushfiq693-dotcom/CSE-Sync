import Link from 'next/link';
import { Button } from '@/client/components/ui/button';
import { Card, CardContent } from '@/client/components/ui/card';
import { ProfileService } from '@/server/services/profile.service';
import { SessionService } from '@/server/services/session.service';
import {
  Users,
  GraduationCap,
  Search,
  ArrowRight,
  ShieldCheck,
  Building2,
  Sparkles,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let studentCount = 0;
  let alumniCount = 0;
  let sessionsCount = 0;

  try {
    const students = await ProfileService.getPublicProfiles({ profile_type: 'student' });
    const alumni = await ProfileService.getPublicProfiles({ profile_type: 'alumni' });
    const sessions = await SessionService.getSessions();
    studentCount = students.length;
    alumniCount = alumni.length;
    sessionsCount = sessions.length;
  } catch (err) {
    console.warn('Database connection initial check');
  }

  return (
    <div className="space-y-16 py-6 sm:py-10">
      
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-6">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold tracking-wide">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Official Departmental Directory</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground leading-tight">
          Department of <span className="text-primary">Computer Science & Engineering</span>
        </h1>

        <p className="text-lg sm:text-xl font-medium text-muted-foreground">
          Gopalganj Science and Technology University (GSTU)
        </p>

        <p className="text-base text-muted-foreground/90 max-w-2xl mx-auto leading-relaxed">
          Welcome to the centralized Student & Alumni Directory. Browse verified profiles of current undergraduate students and alumni across all sessions.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link href="/students" className="group">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2.5 h-12 px-6 rounded-xl font-semibold text-sm sm:text-base text-white bg-gradient-to-r from-[#B87B10] via-[#A86E0B] to-[#8E5B05] hover:from-[#C48514] hover:to-[#9B6406] shadow-lg shadow-amber-900/15 hover:shadow-xl hover:shadow-amber-900/25 border border-white/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <Users className="h-5 w-5 text-white/90" />
              <span>Explore Current Students</span>
              <ArrowRight className="h-4 w-4 text-white/80 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </Link>

          <Link href="/alumni" className="group">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2.5 h-12 px-6 rounded-xl font-semibold text-sm sm:text-base text-white bg-gradient-to-r from-[#B87B10] via-[#A86E0B] to-[#8E5B05] hover:from-[#C48514] hover:to-[#9B6406] shadow-lg shadow-amber-900/15 hover:shadow-xl hover:shadow-amber-900/25 border border-white/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <GraduationCap className="h-5 w-5 text-white/90" />
              <span>Explore Alumni Directory</span>
              <ArrowRight className="h-4 w-4 text-white/80 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </Link>
        </div>

      </section>

      {/* Directory Metrics & Statistics Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
        
        <Link href="/students" className="group">
          <Card className="hover:border-primary/50 hover:shadow-md transition-all duration-200 bg-card">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Students</p>
                <h3 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors">
                  {studentCount} Profiles
                </h3>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/alumni" className="group">
          <Card className="hover:border-primary/50 hover:shadow-md transition-all duration-200 bg-card">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100/70 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Graduated Alumni</p>
                <h3 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors">
                  {alumniCount} Profiles
                </h3>
              </div>
            </CardContent>
          </Card>
        </Link>

        <div className="group">
          <Card className="bg-card">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Academic Batches</p>
                <h3 className="text-2xl font-black text-foreground">
                  {sessionsCount || '15'} Batches
                </h3>
              </div>
            </CardContent>
          </Card>
        </div>

      </section>

      {/* Directory Feature Highlights */}
      <section className="bg-muted/30 border border-border/70 rounded-2xl p-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-foreground">
              <Search className="h-4 w-4 text-primary" /> Instant Discovery
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Fast filtering by academic batch, Student ID sorting, and instant search by name or ID.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" /> Verified Department Data
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Maintained and audited through departmental members and administration with verified attribution.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-foreground">
              <Building2 className="h-4 w-4 text-primary" /> Career & Connections
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Explore alumni employment status, workplace locations, and professional social profiles.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}
