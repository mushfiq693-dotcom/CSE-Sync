// ==============================================================================
// GSTU CSE Directory — Authentication Service
// ==============================================================================

import { createSupabaseServerClient, getSupabaseAdminClient } from '../db/supabase-server';
import type { RegisterInput, LoginInput } from '../validations/auth.validation';
import type { UserProfileRecord } from '../db/schema.types';

export class AuthService {
  /**
   * Registers a new user with pending status and auto-confirmed email.
   */
  static async signUp(input: RegisterInput) {
    const adminClient = getSupabaseAdminClient();

    const { data, error } = await adminClient.auth.admin.createUser({
      email: input.email,
      password: input.password,
      email_confirm: true,
      user_metadata: {
        name: input.name,
        student_id: input.student_id,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      message: 'Registration successful. Your account is waiting for admin approval.',
      user: data.user,
    };
  }

  /**
   * Signs in a user and verifies their approved status.
   * If the account is pending approval, signs out and returns a descriptive error message.
   */
  static async signIn(input: LoginInput) {
    const supabase = await createSupabaseServerClient();

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });

    if (authError || !authData.user) {
      return {
        success: false,
        error: authError?.message || 'Invalid email or password',
      };
    }

    // Fetch user profile status
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError || !userProfile) {
      await supabase.auth.signOut();
      return {
        success: false,
        error: 'User profile not found. Please contact an administrator.',
      };
    }

    const profile = userProfile as unknown as UserProfileRecord;

    // Check approval status
    if (profile.status !== 'approved') {
      await supabase.auth.signOut();
      return {
        success: false,
        isPending: true,
        error: 'Your account is waiting for admin approval.',
      };
    }

    return {
      success: true,
      user: authData.user,
      profile,
    };
  }

  /**
   * Signs the current user out.
   */
  static async signOut() {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
    return { success: true };
  }

  /**
   * Resolves the current session user with their user_profile record.
   */
  static async getCurrentUser(): Promise<UserProfileRecord | null> {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return (profile as unknown as UserProfileRecord) || null;
  }

  /**
   * Guard helper: throws if not an approved user.
   */
  static async requireApprovedUser(): Promise<UserProfileRecord> {
    const profile = await this.getCurrentUser();
    if (!profile || profile.status !== 'approved') {
      throw new Error('Forbidden: You must be an approved user to perform this action.');
    }
    return profile;
  }

  /**
   * Guard helper: throws if not an approved admin.
   */
  static async requireAdmin(): Promise<UserProfileRecord> {
    const profile = await this.requireApprovedUser();
    if (profile.role !== 'admin') {
      throw new Error('Forbidden: Admin access required.');
    }
    return profile;
  }
}
