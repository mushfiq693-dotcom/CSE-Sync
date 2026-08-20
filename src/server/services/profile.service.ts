// ==============================================================================
// GSTU CSE Directory — Profile Service (Student & Alumni Directory)
// ==============================================================================

import { createSupabaseServerClient } from '../db/supabase-server';
import { AuthService } from './auth.service';
import type { ProfileInput } from '../validations/profile.validation';
import type { ProfileRecord } from '../db/schema.types';

export interface ProfileFilterOptions {
  profile_type?: 'student' | 'alumni';
  session_id?: string;
  search?: string;
}

export class ProfileService {
  /**
   * Retrieves public profiles with search, session filtering, and Student ID sorting.
   */
  static async getPublicProfiles(options: ProfileFilterOptions = {}): Promise<ProfileRecord[]> {
    try {
      const supabase = await createSupabaseServerClient();

      let query = (supabase.from('profiles') as any)
        .select(`
          *,
          session:sessions (id, label, sort_order)
        `);

      // Filter by type (student vs alumni)
      if (options.profile_type) {
        query = query.eq('profile_type', options.profile_type);
      }

      // Filter by session/batch
      if (options.session_id && options.session_id !== 'all') {
        query = query.eq('session_id', options.session_id);
      }

      // Search by Name or Student ID
      if (options.search && options.search.trim() !== '') {
        const term = options.search.trim();
        query = query.or(`full_name.ilike.%${term}%,student_id.ilike.%${term}%`);
      }

      // Always sort by student_id ASC
      query = query.order('student_id', { ascending: true });

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching public profiles:', error.message || error);
        return [];
      }

      return (data as unknown as ProfileRecord[]) || [];
    } catch (err: any) {
      console.error('Unexpected error in getPublicProfiles:', err.message || err);
      return [];
    }
  }

  /**
   * Retrieves a single profile by its ID.
   */
  static async getProfileById(id: string): Promise<ProfileRecord | null> {
    try {
      const supabase = await createSupabaseServerClient();

      const { data, error } = await (supabase.from('profiles') as any)
        .select(`
          *,
          session:sessions (id, label, sort_order)
        `)
        .eq('id', id)
        .single();

      if (error || !data) {
        return null;
      }

      return data as unknown as ProfileRecord;
    } catch (err: any) {
      console.error('Unexpected error in getProfileById:', err.message || err);
      return null;
    }
  }

  /**
   * Creates a new Student or Alumni profile.
   * Resolves created_by and updated_by server-side from the authenticated session.
   */
  static async createProfile(input: ProfileInput) {
    const currentUser = await AuthService.requireApprovedUser();
    const supabase = await createSupabaseServerClient();

    const payload = {
      ...input,
      created_by: currentUser.id,
      updated_by: currentUser.id,
    };

    const { data, error } = await (supabase.from('profiles') as any)
      .insert(payload)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        if (error.message.includes('unique_student_id_per_profile_type')) {
          return { success: false, error: 'A profile with this Student ID already exists in this category.' };
        }
      }
      return { success: false, error: error.message };
    }

    return { success: true, profile: data as unknown as ProfileRecord };
  }

  /**
   * Updates an existing profile (Shared Edit).
   * Any approved user can update any profile.
   * created_by is preserved, updated_by is assigned to the current editor.
   */
  static async updateProfile(id: string, input: ProfileInput) {
    const currentUser = await AuthService.requireApprovedUser();
    const supabase = await createSupabaseServerClient();

    const updatePayload = {
      ...input,
      updated_by: currentUser.id,
    };

    const { data, error } = await (supabase.from('profiles') as any)
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        if (error.message.includes('unique_student_id_per_profile_type')) {
          return { success: false, error: 'A profile with this Student ID already exists in this category.' };
        }
      }
      return { success: false, error: error.message };
    }

    return { success: true, profile: data as unknown as ProfileRecord };
  }

  /**
   * Deletes a profile. Admin only.
   */
  static async deleteProfile(id: string) {
    await AuthService.requireAdmin();
    const supabase = await createSupabaseServerClient();

    const { error } = await (supabase.from('profiles') as any).delete().eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  }
}
