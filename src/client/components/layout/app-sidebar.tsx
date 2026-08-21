'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Shield, MessageSquare, X, ChevronRight, LayoutDashboard, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeTogglePill } from '@/client/components/ui/theme-toggle-pill';
import type { UserProfileRecord } from '@/server/db/schema.types';
import { cn } from '@/client/lib/utils';

interface AppSidebarProps {
  currentUser?: UserProfileRecord | null;
}

export function AppSidebar({ currentUser }: AppSidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isHelpOpen, setIsHelpOpen] = React.useState(false);

  // Close sidebar on route change
  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Close sidebar on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Only render the floating Dashboard trigger and drawer if user is SIGNED IN and on the Home page ('/')
  if (!currentUser || pathname !== '/') {
    return null;
  }

  const navItems = [
    {
      href: '/',
      label: 'Home',
      icon: LayoutGrid,
      badge: undefined,
    },
    {
      href: '/dashboard/user',
      label: 'Member Dashboard',
      icon: LayoutDashboard,
      badge: 'Member',
    },
  ];

  if (currentUser?.role === 'admin') {
    navItems.push({
      href: '/dashboard/admin',
      label: 'Admin Panel',
      icon: Shield,
      badge: 'Admin',
    });
  }

  return (
    <>
      {/* ─── Floating "Dashboard" Trigger Pill: Placed right below the CSE logo on the left (Signed In Users on Home Page Only) ─── */}
      <div className="fixed left-3 sm:left-4 top-[4.75rem] z-40">
        <motion.button
          type="button"
          onClick={() => setIsOpen(true)}
          title="Open Dashboard Navigation"
          whileHover={{ scale: 1.05, x: 2 }}
          whileTap={{ scale: 0.95 }}
          className="group relative flex items-center gap-2.5 pl-3 pr-3.5 py-2 rounded-2xl bg-card/95 dark:bg-zinc-900/95 text-foreground shadow-[0_4px_20px_rgba(168,110,11,0.22)] hover:shadow-[0_8px_28px_rgba(168,110,11,0.32)] border border-amber-500/40 backdrop-blur-xl transition-all select-none"
        >
          {/* Pulsing Glowing Indicator */}
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
          </span>

          <div className="flex items-center gap-2">
            <LayoutGrid className="h-4 w-4 text-primary transition-transform group-hover:rotate-12 duration-200" />
            <span className="text-xs font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
              Dashboard
            </span>
          </div>

          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
        </motion.button>
      </div>

      {/* ─── Modal Backdrop + Slide-in Drawer Sidebar ─── */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex">
            
            {/* Full Homepage Blur Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md"
              aria-hidden="true"
            />

            {/* Slide-In Drawer Sidebar */}
            <motion.aside
              initial={{ x: '-100%', opacity: 0.8 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0.8 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="relative w-72 sm:w-80 h-full bg-[#FAF8F4] dark:bg-[#16161B] text-foreground border-r border-amber-500/30 shadow-2xl p-5 flex flex-col justify-between select-none z-50 overflow-y-auto"
            >
              
              {/* Top: Header & Nav Links */}
              <div className="space-y-6">
                
                {/* Brand Emblem + Close Button */}
                <div className="flex items-center justify-between pb-4 border-b border-amber-900/10 dark:border-zinc-800">
                  <Link
                    href="/"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 group"
                  >
                    {/* Modern CSE Terminal Shield Logo */}
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-600 via-primary to-amber-950 text-white shadow-lg border border-amber-400/50 group-hover:scale-105 transition-transform shrink-0">
                      <svg viewBox="0 0 24 24" className="h-6 w-6 stroke-current stroke-[2] fill-none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" fill="currentColor" fillOpacity="0.15" />
                        <polyline points="8 10 11 13 8 16" />
                        <line x1="13" y1="16" x2="16" y2="16" />
                      </svg>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-black tracking-tight text-foreground group-hover:text-primary transition-colors">
                        GSTU CSE
                      </span>
                      <span className="text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
                        Directory Hub
                      </span>
                    </div>
                  </Link>

                  {/* Close (X) Button */}
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close sidebar"
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-foreground border border-amber-500/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <X className="h-4 w-4 text-foreground" />
                  </button>
                </div>

                {/* Navigation Links: High Contrast & Highlighted */}
                <nav className="flex flex-col gap-2.5" aria-label="Dashboard navigation">
                  {navItems.map((item) => {
                    const isActive =
                      item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        aria-current={isActive ? 'page' : undefined}
                        className={cn(
                          'group relative flex items-center justify-between rounded-2xl text-sm px-4 py-3 cursor-pointer outline-none transition-all duration-200 border',
                          'focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2',
                          isActive
                            ? 'bg-gradient-to-r from-amber-100 via-amber-100/90 to-amber-200/80 dark:from-amber-950/70 dark:via-amber-900/50 dark:to-amber-800/40 text-amber-950 dark:text-amber-100 shadow-[0_4px_16px_rgba(168,110,11,0.18)] border-amber-500/50 font-black'
                            : 'bg-white/80 dark:bg-zinc-900/80 text-zinc-900 dark:text-zinc-100 hover:bg-amber-500/15 dark:hover:bg-amber-500/20 hover:text-amber-950 dark:hover:text-amber-200 border-amber-900/10 dark:border-zinc-800 shadow-sm font-bold'
                        )}
                      >
                        <motion.div
                          className="flex items-center gap-3.5 min-w-0"
                          whileHover={{ x: 4 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        >
                          <div className={cn(
                            'p-1.5 rounded-xl transition-colors',
                            isActive ? 'bg-primary/20 text-primary' : 'bg-amber-500/10 text-primary group-hover:bg-primary/20'
                          )}>
                            <Icon className="h-4 w-4 stroke-[2.25]" />
                          </div>
                          <span className="truncate">{item.label}</span>
                        </motion.div>

                        {item.badge && (
                          <span
                            className={cn(
                              'inline-flex items-center justify-center min-w-[1.75rem] h-[1.375rem] px-2 text-[10px] font-black leading-none rounded-full border transition-colors',
                              isActive
                                ? 'bg-primary/20 text-primary border-primary/40 dark:bg-primary/30 dark:text-amber-200'
                                : 'bg-amber-500/15 text-amber-900 dark:text-amber-300 border-amber-500/30'
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Bottom: Info Bubble + Vertical Theme Switcher */}
              <div className="pt-5 mt-6 flex items-end justify-between border-t border-amber-900/10 dark:border-zinc-800">
                
                {/* Contact/Help Bubble */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsHelpOpen(!isHelpOpen)}
                    title="GSTU CSE Directory Info"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-zinc-900 text-amber-900 dark:text-amber-300 shadow-sm hover:scale-105 border border-amber-900/15 dark:border-zinc-700 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </button>

                  <AnimatePresence>
                    {isHelpOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute bottom-12 left-0 w-60 rounded-2xl bg-card border border-border p-3.5 shadow-2xl z-50 text-xs space-y-1.5 text-foreground"
                      >
                        <p className="font-bold text-foreground">GSTU CSE Directory</p>
                        <p className="text-[11px] text-muted-foreground">
                          Gopalganj Science and Technology University
                        </p>
                        <div className="pt-2 border-t border-border flex flex-col gap-1 text-[11px] text-muted-foreground">
                          <span>15 Academic Batches</span>
                          <span>Active CSE 11–15 &amp; Alumni 01–10</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Vertical Theme Toggle Pill (Moon on Top, Sun on Bottom) */}
                <ThemeTogglePill />

              </div>

            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
