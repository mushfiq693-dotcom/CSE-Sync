import Link from 'next/link';
import { GraduationCap } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border/80 bg-slate-50/50 dark:bg-slate-950/50 py-10 mt-auto w-full">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-xs shadow-sm">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Department of Computer Science &amp; Engineering
              </p>
              <p className="text-xs text-muted-foreground">
                Gopalganj Science and Technology University (GSTU), Gopalganj-8100, Bangladesh
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs font-medium text-muted-foreground">
            <Link href="/students" className="hover:text-foreground transition-colors">
              Students
            </Link>
            <Link href="/alumni" className="hover:text-foreground transition-colors">
              Alumni
            </Link>
            <Link href="/login" className="hover:text-foreground transition-colors">
              Management Portal
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/60 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} GSTU CSE Department. Official Student &amp; Alumni Directory. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
