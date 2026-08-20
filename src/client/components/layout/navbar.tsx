'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/client/components/ui/button';
import {
  GraduationCap,
  Users,
  UserCheck,
  LayoutDashboard,
  Menu,
  X,
  LogOut,
  ChevronDown,
  ShieldCheck,
  User,
} from 'lucide-react';
import { cn } from '@/client/lib/utils';
import { logoutAction } from '@/server/actions/auth.actions';
import type { UserProfileRecord } from '@/server/db/schema.types';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  currentUser?: UserProfileRecord | null;
}

export function Navbar({ currentUser }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement | null>(null);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/students', label: 'Current Students', icon: Users },
    { href: '/alumni', label: 'Alumni Directory', icon: GraduationCap },
  ];

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
      setIsMobileMenuOpen(false);
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Sign out error:', err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const dashboardHref =
    currentUser?.role === 'admin' ? '/dashboard/admin' : '/dashboard/user';

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
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
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
              Gopalganj Science & Tech University
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                {Icon && <Icon className="h-4 w-4" />}
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action: User Profile Dropdown OR Sign In/Register Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {currentUser ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-border/80 bg-card hover:bg-muted/60 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                aria-expanded={isProfileDropdownOpen}
              >
                {/* Circular Initial Avatar */}
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xs shadow-sm">
                  {initials}
                </div>

                {/* User Name */}
                <span className="text-xs font-semibold text-foreground max-w-[130px] truncate">
                  {currentUser.name}
                </span>

                {/* Role Pill */}
                <span
                  className={cn(
                    'text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md',
                    currentUser.role === 'admin'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-300'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {currentUser.role === 'admin' ? 'Admin' : 'Member'}
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
                            : 'Verified Member Account'}
                        </span>
                      </div>
                    </div>

                    {/* Navigation Menu */}
                    <div className="space-y-1">
                      <Link
                        href={dashboardHref}
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <LayoutDashboard className="h-4 w-4 text-primary shrink-0" />
                        <span>Open Dashboard</span>
                      </Link>

                      <button
                        type="button"
                        onClick={handleSignOut}
                        disabled={isLoggingOut}
                        className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-semibold text-destructive hover:bg-destructive/10 transition-colors"
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
            <>
              <Link href="/login">
                <Button variant="outline" size="sm" className="gap-1.5 font-medium">
                  <UserCheck className="h-4 w-4" />
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="gap-1.5 font-medium shadow-sm">
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium',
                  isActive
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                {Icon && <Icon className="h-4 w-4" />}
                {link.label}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-border flex flex-col gap-2">
            {currentUser ? (
              <div className="space-y-2 bg-muted/30 p-3 rounded-xl border border-border/70">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xs">
                    {initials}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">{currentUser.name}</p>
                    <p className="text-[10px] text-muted-foreground font-medium">
                      ID: {currentUser.student_id} ({currentUser.role})
                    </p>
                  </div>
                </div>

                <Link href={dashboardHref} onClick={() => setIsMobileMenuOpen(false)}>
                  <Button size="sm" className="w-full justify-center gap-1.5 mt-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Open Dashboard
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  disabled={isLoggingOut}
                  className="w-full justify-center text-destructive border-destructive/30 hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4 mr-1.5" />
                  {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
                </Button>
              </div>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full justify-center">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button size="sm" className="w-full justify-center">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
