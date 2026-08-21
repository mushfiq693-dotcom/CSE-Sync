// ==============================================================================
// GSTU CSE Directory — Profile Validation Schemas
// ==============================================================================

import { z } from 'zod';

const sanitizeOptionalUrl = (val: unknown) => {
  if (typeof val !== 'string') return null;
  const trimmed = val.trim();
  if (!trimmed) return null;
  // If user pasted something like linkedin.com/in/john, auto-prefix https://
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
};

const optionalUrlField = z.preprocess(
  sanitizeOptionalUrl,
  z.string().url('Please provide a valid web URL (e.g. https://...)').optional().nullable().or(z.literal(''))
);

export const profileSchema = z.object({
  full_name: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(150, 'Full name cannot exceed 150 characters')
    .trim(),
  student_id: z
    .string()
    .min(3, 'Student ID must be at least 3 characters')
    .max(50, 'Student ID cannot exceed 50 characters')
    .trim(),
  profile_type: z.enum(['student', 'alumni'], {
    errorMap: () => ({ message: 'Profile type must be either student or alumni' }),
  }),
  session_id: z.string().uuid('Please select a valid session/batch'),
  
  // Optional Visual / Contact info
  avatar_url: optionalUrlField,
  phone: z.string().max(30).optional().nullable().or(z.literal('')),
  facebook_url: optionalUrlField,
  instagram_url: optionalUrlField,
  linkedin_url: optionalUrlField,

  // Career Info
  job_status: z.enum(['employed', 'business_owner', 'unemployed', 'teaching', 'other']).default('unemployed'),
  workplace: z.string().max(255).optional().nullable().or(z.literal('')),
  workplace_details: z.string().max(1000).optional().nullable().or(z.literal('')),

  // Location Info
  home_district: z.string().max(100).optional().nullable().or(z.literal('')),
  hometown: z.string().max(100).optional().nullable().or(z.literal('')),
  current_city: z.string().max(100).optional().nullable().or(z.literal('')),

  // Pre-university Education
  school: z.string().max(255).optional().nullable().or(z.literal('')),
  college: z.string().max(255).optional().nullable().or(z.literal('')),
});

export type ProfileInput = z.infer<typeof profileSchema>;
