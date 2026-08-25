import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRoll(roll: number): string {
  return String(roll).padStart(2, '0');
}

/**
 * Checks if a given student ID belongs to Batch 15 (CSE 15).
 * Matches formats such as: 15CSE001, 15-CSE-001, CSE15001, 1501001, etc.
 * Avoids false matches like 14CSE015.
 */
export function isBatch15(studentId?: string | null): boolean {
  if (!studentId) return false;
  const clean = studentId.trim().toUpperCase().replace(/[\s\-_/]/g, '');
  if (/^15/i.test(clean)) return true;
  if (/^CSE15/i.test(clean)) return true;
  return false;
}

/**
 * Checks if a user belongs to Batch 15 and is not an administrator.
 */
export function isBatch15User(user?: { role?: string; student_id?: string } | null): boolean {
  if (!user) return false;
  if (user.role === 'admin') return false;
  return isBatch15(user.student_id);
}

