// ==============================================================================
// GSTU CSE Directory — Supabase Server Client & Admin Helpers
// ==============================================================================

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import type { Database } from './schema.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

/**
 * Creates a server-side Supabase client bound to the current request's cookies.
 * Safe for Server Components, Route Handlers, and Server Actions.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing user sessions.
        }
      },
    },
  });
}

let publicSupabaseClient: ReturnType<typeof createClient<Database>> | null = null;

/**
 * Creates a public Supabase client for reading public data (profiles, sessions)
 * without accessing request cookies. This enables Next.js to perform true static generation & Edge ISR!
 */
export function getSupabasePublicClient() {
  if (!publicSupabaseClient) {
    publicSupabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return publicSupabaseClient;
}

/**
 * Supabase Admin Client with Service Role Key.
 * EXCLUSIVELY for server-side elevated actions (e.g. deleting rejected users, seed/management).
 * Never import or use this on the client side!
 */
export function getSupabaseAdminClient() {
  if (!supabaseServiceRoleKey) {
    console.warn('⚠️ SUPABASE_SERVICE_ROLE_KEY is not defined. Admin operations may fail.');
  }

  return createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
