'use client';

import * as React from 'react';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/client/lib/utils';

export function ThemeTogglePill({ className = '' }: { className?: string }) {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem('gstu_theme') as 'light' | 'dark' | null;
    const isDarkSystem = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const activeTheme = storedTheme || (isDarkSystem ? 'dark' : 'light');

    setTheme(activeTheme);
    if (activeTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const setMode = (mode: 'light' | 'dark') => {
    setTheme(mode);
    localStorage.setItem('gstu_theme', mode);
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  if (!mounted) {
    return (
      <div className={cn('w-10 rounded-full bg-[#EDE5D8] dark:bg-zinc-800 p-1 flex flex-col items-center gap-1 shadow-inner border border-amber-900/15', className)}>
        <div className="h-7 w-7 rounded-full flex items-center justify-center text-amber-900/50">
          <Moon className="h-4 w-4" />
        </div>
        <div className="h-7 w-7 rounded-full bg-white shadow-sm flex items-center justify-center text-amber-700">
          <Sun className="h-4 w-4" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'w-10 rounded-full bg-[#EDE5D8] dark:bg-zinc-800/90 p-1 flex flex-col items-center gap-1 shadow-inner border border-amber-900/15 dark:border-amber-500/20 transition-colors',
        className
      )}
    >
      {/* Dark Mode (Moon) */}
      <button
        type="button"
        onClick={() => setMode('dark')}
        title="Switch to Dark Mode"
        className={cn(
          'h-7 w-7 rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none',
          theme === 'dark'
            ? 'bg-zinc-950 text-amber-300 shadow-md scale-105 border border-amber-500/40'
            : 'text-zinc-600 dark:text-zinc-400 hover:text-amber-800 dark:hover:text-zinc-200'
        )}
      >
        <Moon className="h-3.5 w-3.5" />
      </button>

      {/* Light Mode (Sun) */}
      <button
        type="button"
        onClick={() => setMode('light')}
        title="Switch to Light Mode"
        className={cn(
          'h-7 w-7 rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none',
          theme === 'light'
            ? 'bg-white text-amber-700 shadow-md scale-105 border border-amber-200'
            : 'text-zinc-600 dark:text-zinc-400 hover:text-amber-800 dark:hover:text-zinc-200'
        )}
      >
        <Sun className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
