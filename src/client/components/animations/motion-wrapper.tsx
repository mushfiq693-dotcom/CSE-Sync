'use client';

import * as React from 'react';
import { cn } from '@/client/lib/utils';

export interface FadeInProps extends React.HTMLAttributes<HTMLDivElement> {
  delay?: number;
  duration?: number;
}

export function FadeIn({
  children,
  className,
  ...props
}: FadeInProps) {
  return (
    <div
      className={cn('transition-opacity duration-300 opacity-100', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function StaggerContainer({
  children,
  className,
  staggerDelay,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { staggerDelay?: number }) {
  return (
    <div
      className={className}
      {...props}
    >
      {children}
    </div>
  );
}

export function StaggerItem({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('transition-all duration-200', className)}
      {...props}
    >
      {children}
    </div>
  );
}

