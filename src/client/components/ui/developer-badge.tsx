'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Github, Linkedin, ExternalLink, X, Code2, Sparkles } from 'lucide-react';

export interface DeveloperBadgeProps {
  name?: string;
  initial?: string;
  role?: string;
  tagline?: string;
  portfolioUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  className?: string;
}

export function DeveloperBadge({
  name = 'Mushfiqur Rahman',
  initial = 'M',
  role = 'Full-stack Developer',
  tagline = 'Architected & developed with modern web standards by Mushfiq.',
  portfolioUrl = 'https://portfolio2-8i64o9nca-zeni-n-clan.vercel.app',
  githubUrl = 'https://github.com/mushfiq693-dotcom',
  linkedinUrl = 'https://www.linkedin.com/in/mushfiqur-rahman-9760a8410/',
  className = '',
}: DeveloperBadgeProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  // Close on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 select-none ${className}`}
    >
      {/* Popover Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.9 }}
            transition={{
              type: 'spring',
              stiffness: 420,
              damping: 30,
            }}
            style={{ transformOrigin: 'bottom right' }}
            className="absolute bottom-14 right-0 sm:bottom-16 sm:right-0 w-[290px] sm:w-[320px] rounded-2xl border border-border/80 bg-card/95 backdrop-blur-xl p-4 sm:p-5 shadow-2xl shadow-black/25 text-card-foreground overflow-hidden"
          >
            {/* Ambient subtle glow background */}
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-28 h-28 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

            {/* Header: Avatar, Name & Close button */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-white font-black text-base shadow-md border border-zinc-700/50 shrink-0">
                  {initial}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-sm text-foreground truncate">{name}</h4>
                    <Sparkles className="h-3 w-3 text-primary shrink-0" />
                  </div>
                  <p className="text-xs font-semibold text-primary">{role}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors focus:outline-none"
                aria-label="Close Developer Info"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Short Tagline */}
            <p className="text-xs text-muted-foreground leading-relaxed mb-4">
              {tagline}
            </p>

            {/* Social & Portfolio Links Grid */}
            <div className="space-y-1.5 pt-2 border-t border-border/70">
              {portfolioUrl && (
                <a
                  href={portfolioUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/30 hover:bg-primary/10 hover:text-primary border border-border/50 transition-all text-xs font-medium group"
                >
                  <span className="flex items-center gap-2">
                    <Globe className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>Portfolio Website</span>
                  </span>
                  <ExternalLink className="h-3 w-3 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </a>
              )}

              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/30 hover:bg-muted hover:text-foreground border border-border/50 transition-all text-xs font-medium group"
                >
                  <span className="flex items-center gap-2">
                    <Github className="h-3.5 w-3.5 shrink-0" />
                    <span>GitHub Profile</span>
                  </span>
                  <ExternalLink className="h-3 w-3 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </a>
              )}

              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/30 hover:bg-[#0A66C2]/10 hover:text-[#0A66C2] border border-border/50 transition-all text-xs font-medium group"
                >
                  <span className="flex items-center gap-2">
                    <Linkedin className="h-3.5 w-3.5 text-[#0A66C2] shrink-0" />
                    <span>LinkedIn Profile</span>
                  </span>
                  <ExternalLink className="h-3 w-3 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </a>
              )}
            </div>

            {/* Footer note */}
            <div className="mt-3 pt-2 text-[10px] text-muted-foreground/80 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Code2 className="h-3 w-3 text-primary" /> Developer Signature
              </span>
              <span className="font-mono text-[9px] opacity-70">GSTU CSE Sync</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Circular Badge Button */}
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-zinc-950 text-white font-bold text-sm sm:text-base shadow-lg shadow-black/25 border border-zinc-700/60 hover:border-primary/80 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label="Developer Information & Signature"
        title="Designed & Developed by Mushfiqur Rahman"
      >
        <span className="font-black tracking-tight">{initial}</span>

        {/* Small active badge dot indicator */}
        <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
        </span>
      </motion.button>
    </div>
  );
}
