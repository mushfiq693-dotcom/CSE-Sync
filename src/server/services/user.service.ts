// ==============================================================================
// GSTU CSE Directory — Admin User Management Service
// ==============================================================================

import { createSupabaseServerClient, getSupabaseAdminClient } from '../db/supabase-server';
import { AuthService } from './auth.service';
import type { UserProfileRecord, UserRole } from '../db/schema.types';

export class UserService {
  /**
   * Fetches all users pending admin approval. Admin only.
   */
  static async getPendingUsers(): Promise<UserProfileRecord[]> {
    await AuthService.requireAdmin();
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to load pending users: ${error.message}`);
    }

    return (data as unknown as UserProfileRecord[]) || [];
  }

  /**
   * Fetches all approved users. Admin only.
   */
  static async getApprovedUsers(): Promise<UserProfileRecord[]> {
    await AuthService.requireAdmin();
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('status', 'approved')
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Failed to load approved users: ${error.message}`);
    }

    return (data as unknown as UserProfileRecord[]) || [];
  }

  /**
   * Approves a pending user registration. Admin only.
   */
  static async approveUser(targetUserId: string) {
    await AuthService.requireAdmin();
    const supabase = await createSupabaseServerClient();

    const { error } = await (supabase.from('user_profiles') as any)
      .update({ status: 'approved' })
      .eq('id', targetUserId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, message: 'User approved successfully.' };
  }

  /**
   * Rejects a pending user registration. Admin only.
   * Completely removes the user from user_profiles and Supabase Auth to free the email.
   */
  static async rejectUser(targetUserId: string) {
    await AuthService.requireAdmin();
    const supabase = await createSupabaseServerClient();
    const adminClient = getSupabaseAdminClient();

    // 1. Delete from public table
    const { error: dbError } = await supabase
      .from('user_profiles')
      .delete()
      .eq('id', targetUserId)
      .eq('status', 'pending');

    if (dbError) {
      return { success: false, error: dbError.message };
    }

    // 2. Delete from auth.users via Admin API (frees up email)
    if (adminClient) {
      const { error: authError } = await adminClient.auth.admin.deleteUser(targetUserId);
      if (authError) {
        console.warn('Warning: Could not delete auth user record:', authError.message);
      }
    }

    return { success: true, message: 'Pending user rejected and record removed.' };
  }

  /**
   * Updates a user's role. Admin only.
   */
  static async updateUserRole(targetUserId: string, newRole: UserRole) {
    await AuthService.requireAdmin();
    const supabase = await createSupabaseServerClient();

    const { error } = await (supabase.from('user_profiles') as any)
      .update({ role: newRole })
      .eq('id', targetUserId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, message: 'User role updated.' };
  }
}
