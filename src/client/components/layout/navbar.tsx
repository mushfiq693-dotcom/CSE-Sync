'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/client/components/ui/button';
import {
  UserCheck,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  ShieldCheck,
} from 'lucide-react';
import { cn, isBatch15 } from '@/client/lib/utils';
import { logoutAction } from '@/server/actions/auth.actions';
import type { UserProfileRecord } from '@/server/db/schema.types';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  currentUser?: UserProfileRecord | null;
}

export function Navbar({ currentUser }: NavbarProps) {
  const router = useRouter();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await logoutAction();
      setIsProfileDropdownOpen(false);
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Sign out error:', err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Get user initials for avatar
  const initials = currentUser?.name
    ? currentUser.name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0].toUpperCase())
        .join('')
    : 'U';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/95 backdrop-blur-md transition-all">
      <div className="container mx-auto relative flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold tracking-wider shadow-sm group-hover:scale-105 transition-transform">
            CSE
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight leading-tight text-foreground group-hover:text-primary transition-colors">
              GSTU CSE Directory
            </span>
            <span className="text-[11px] text-muted-foreground font-medium">
              Gopalganj Science &amp; Tech University
            </span>
          </div>
        </Link>

        {/* Center Inspiring Networking Quote Badge (Mathematically Dead-Centered) */}
        <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 via-primary/10 to-amber-500/10 border border-primary/25 shadow-sm text-xs font-medium text-foreground/90 select-none pointer-events-none">
          <span className="flex h-2 w-2 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          <span className="tracking-tight flex items-center gap-1.5 whitespace-nowrap">
            <span className="font-bold text-primary">Bridging Generations</span>
            <span className="text-muted-foreground/60">•</span>
            <span>Connecting GSTU CSE Students &amp; Alumni</span>
          </span>
        </div>

        {/* Right Action: User Profile Dropdown OR Sign In/Register Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {currentUser ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3 py-1.5 rounded-full border border-border/80 bg-card hover:bg-muted/60 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                aria-expanded={isProfileDropdownOpen}
              >
                {/* Circular Initial Avatar */}
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xs shadow-sm">
                  {initials}
                </div>

                {/* User Name */}
                <span className="text-xs font-semibold text-foreground max-w-[100px] sm:max-w-[130px] truncate">
                  {currentUser.name}
                </span>

                {/* Role Pill */}
                <span
                  className={cn(
                    'text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md hidden xs:inline-block',
                    currentUser.role === 'admin'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-300'
                      : isBatch15(currentUser.student_id)
                      ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30 font-semibold'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {currentUser.role === 'admin'
                    ? 'Admin'
                    : isBatch15(currentUser.student_id)
                    ? 'Batch 15'
                    : 'Member'}
                </span>

                <ChevronDown
                  className={cn(
                    'h-3.5 w-3.5 text-muted-foreground transition-transform duration-200',
                    isProfileDropdownOpen && 'rotate-180'
                  )}
                />
              </button>

              {/* Profile Dropdown Popover */}
              <AnimatePresence>
                {isProfileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute right-0 mt-2 w-64 rounded-2xl border border-border/80 bg-card/95 backdrop-blur-xl p-3 shadow-xl text-card-foreground z-50 overflow-hidden"
                  >
                    {/* Header Info */}
                    <div className="p-2 border-b border-border/60 pb-3 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground font-black text-xs shadow-sm shrink-0">
                          {initials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-foreground truncate">
                            {currentUser.name}
                          </p>
                          <p className="text-[11px] font-medium text-muted-foreground truncate">
                            ID: {currentUser.student_id}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-1.5 text-[10px] text-primary font-semibold">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>
                          {currentUser.role === 'admin'
                            ? 'Administrator Access'
                            : isBatch15(currentUser.student_id)
                            ? 'Batch 15 Directory Access'
                            : 'Verified Member Account'}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={handleSignOut}
                        disabled={isLoggingOut}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-destructive hover:bg-destructive/10 border border-destructive/20 transition-colors"
                      >
                        <LogOut className="h-4 w-4 shrink-0" />
                        <span>{isLoggingOut ? 'Signing out...' : 'Sign Out'}</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="outline" size="sm" className="gap-1.5 font-medium text-xs sm:text-sm h-8 sm:h-9">
                  <UserCheck className="h-3.5 w-3.5" />
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="gap-1.5 font-medium shadow-sm text-xs sm:text-sm h-8 sm:h-9">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
