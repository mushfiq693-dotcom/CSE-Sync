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

      const rawList = (data as unknown as ProfileRecord[]) || [];
      
      // Sort logic: Within batch or list: CR (1) -> ACR (2) -> Other (3), then Student ID ASC
      rawList.sort((a, b) => {
        const getRank = (role?: string | null) => {
          if (role === 'CR') return 1;
          if (role === 'ACR') return 2;
          return 3;
        };
        const rankA = getRank(a.leadership_role);
        const rankB = getRank(b.leadership_role);
        if (rankA !== rankB) {
          return rankA - rankB;
        }
        return a.student_id.localeCompare(b.student_id, undefined, { numeric: true });
      });

      return rawList;
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

    // If not admin, strip out leadership_role to prevent self-elevation
    const sanitizedInput = { ...input };
    if (currentUser.role !== 'admin') {
      delete (sanitizedInput as any).leadership_role;
    }

    const payload = {
      ...sanitizedInput,
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
        if (error.message.includes('unique_batch_leadership')) {
          return { success: false, error: `This batch already has a designated ${input.leadership_role}.` };
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

    const sanitizedInput = { ...input };
    // If not admin, do not allow changing leadership_role
    if (currentUser.role !== 'admin') {
      delete (sanitizedInput as any).leadership_role;
    }

    const updatePayload = {
      ...sanitizedInput,
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
        if (error.message.includes('unique_batch_leadership')) {
          return { success: false, error: `This batch already has a designated ${input.leadership_role}.` };
        }
      }
      return { success: false, error: error.message };
    }

    return { success: true, profile: data as unknown as ProfileRecord };
  }

  /**
   * Sets or clears the leadership role (CR / ACR) for a profile.
   * Admin-only operation. Automatically clears any existing person with the same role in that batch.
   */
  static async setLeadershipRole(profileId: string, role: 'CR' | 'ACR' | null) {
    await AuthService.requireAdmin();
    const supabase = await createSupabaseServerClient();

    // 1. Fetch current profile to get session_id
    const { data: targetProfile, error: fetchError } = await (supabase.from('profiles') as any)
      .select('id, session_id, full_name, leadership_role')
      .eq('id', profileId)
      .single();

    if (fetchError || !targetProfile) {
      return { success: false, error: 'Profile not found.' };
    }

    // 2. If assigning a new role ('CR' or 'ACR'), clear that role from any other student in the same batch
    if (role) {
      await (supabase.from('profiles') as any)
        .update({ leadership_role: null })
        .eq('session_id', targetProfile.session_id)
        .eq('leadership_role', role);
    }

    // 3. Assign role to target profile
    const { error: updateError } = await (supabase.from('profiles') as any)
      .update({ leadership_role: role })
      .eq('id', profileId);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    return { success: true, message: `Successfully updated leadership role.` };
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
