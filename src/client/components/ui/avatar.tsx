import * as React from 'react';
import { cn } from '@/client/lib/utils';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  fallbackText?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Avatar({ src, alt = 'Avatar', fallbackText = 'U', size = 'md', className, ...props }: AvatarProps) {
  const [hasError, setHasError] = React.useState(false);

  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-11 w-11 text-sm',
    lg: 'h-16 w-16 text-lg font-semibold',
    xl: 'h-24 w-24 text-2xl font-bold',
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div
      className={cn(
        'relative flex shrink-0 overflow-hidden rounded-full border border-border/80 bg-slate-100 dark:bg-slate-800 items-center justify-center font-medium text-slate-700 dark:text-slate-200 select-none shadow-sm',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {src && !hasError ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setHasError(true)}
          className="aspect-square h-full w-full object-cover"
        />
      ) : (
        <span>{getInitials(fallbackText)}</span>
      )}
    </div>
  );
}
