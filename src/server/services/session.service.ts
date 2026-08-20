// ==============================================================================
// GSTU CSE Directory — Session / Batch Service
// ==============================================================================

import { createSupabaseServerClient } from '../db/supabase-server';
import { AuthService } from './auth.service';
import type { SessionRecord } from '../db/schema.types';

export class SessionService {
  /**
   * Fetches all sessions/batches ordered by sort_order. Publicly accessible.
   */
  static async getSessions(): Promise<SessionRecord[]> {
    try {
      const supabase = await createSupabaseServerClient();

      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Error fetching sessions:', error.message || error);
        return [];
      }

      return (data as unknown as SessionRecord[]) || [];
    } catch (err: any) {
      console.error('Unexpected error fetching sessions:', err.message || err);
      return [];
    }
  }

  /**
   * Creates a new session/batch. Admin or Approved User inline.
   */
  static async createSession(label: string, sort_order: number) {
    await AuthService.requireApprovedUser();
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from('sessions')
      .insert({ label: label.trim(), sort_order } as any)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return { success: false, error: 'A session with this label already exists.' };
      }
      return { success: false, error: error.message };
    }

    return { success: true, session: data as unknown as SessionRecord };
  }
}
