'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/client/components/ui/button';
import { GraduationCap, Users, UserCheck, LayoutDashboard, Menu, X } from 'lucide-react';
import { cn } from '@/client/lib/utils';

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/students', label: 'Current Students', icon: Users },
    { href: '/alumni', label: 'Alumni Directory', icon: GraduationCap },
  ];

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

        {/* Right CTA / Portal Access */}
        <div className="hidden md:flex items-center gap-3">
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
          </div>
        </div>
      )}
    </header>
  );
}
