'use server';

// ==============================================================================
// GSTU CSE Directory — Profile Server Actions (Add, Edit, Delete)
// ==============================================================================

import { profileSchema } from '../validations/profile.validation';
import { ProfileService } from '../services/profile.service';
import { getSupabaseAdminClient } from '../db/supabase-server';
import { revalidatePath } from 'next/cache';

/**
 * Uploads a profile picture to Supabase Storage and returns the public URL.
 */
export async function uploadAvatarAction(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    if (!file || file.size === 0) {
      return { success: false, error: 'Please select an image file.' };
    }

    if (file.size > 10 * 1024 * 1024) {
      return { success: false, error: 'Image size cannot exceed 10MB.' };
    }

    const adminClient = getSupabaseAdminClient();
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `avatar-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage bucket 'profile-pictures'
    const { error: uploadError } = await adminClient.storage
      .from('profile-pictures')
      .upload(fileName, buffer, {
        contentType: file.type || 'image/jpeg',
        upsert: true,
      });

    if (uploadError) {
      console.error('Avatar upload failed:', uploadError);
      return { 
        success: false, 
        error: uploadError.message?.includes('bucket') 
          ? "Storage bucket 'profile-pictures' not found. Please ensure it is created in Supabase Storage."
          : (uploadError.message || 'Failed to upload photo to storage.') 
      };
    }

    const { data: urlData } = adminClient.storage
      .from('profile-pictures')
      .getPublicUrl(fileName);

    return {
      success: true,
      url: urlData.publicUrl,
    };
  } catch (err: any) {
    console.error('Avatar upload unexpected error:', err);
    return { success: false, error: err.message || 'Failed to upload photo.' };
  }
}

export async function createProfileAction(prevState: any, formData: FormData) {
  try {
    const rawData: Record<string, any> = {};
    formData.forEach((value, key) => {
      rawData[key] = value === '' ? null : value;
    });

    const validation = profileSchema.safeParse(rawData);
    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      const firstError = Object.values(fieldErrors).flat()[0] || 'Please fill in all required fields properly.';
      return {
        success: false,
        errors: fieldErrors,
        error: firstError,
      };
    }

    const result = await ProfileService.createProfile(validation.data);
    if (result.success) {
      revalidatePath('/students');
      revalidatePath('/alumni');
      revalidatePath('/dashboard/user');
      revalidatePath('/dashboard/admin');
    }

    return result;
  } catch (err: any) {
    console.error('Create profile error:', err);
    return {
      success: false,
      error: err.message || 'An unexpected error occurred while creating profile.',
    };
  }
}

export async function updateProfileAction(profileId: string, prevState: any, formData: FormData) {
  try {
    const rawData: Record<string, any> = {};
    formData.forEach((value, key) => {
      rawData[key] = value === '' ? null : value;
    });

    const validation = profileSchema.safeParse(rawData);
    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      const firstError = Object.values(fieldErrors).flat()[0] || 'Please fill in all required fields properly.';
      return {
        success: false,
        errors: fieldErrors,
        error: firstError,
      };
    }

    const result = await ProfileService.updateProfile(profileId, validation.data);
    if (result.success) {
      revalidatePath('/students');
      revalidatePath('/alumni');
      revalidatePath(`/profile/${profileId}`);
      revalidatePath('/dashboard/user');
      revalidatePath('/dashboard/admin');
    }

    return result;
  } catch (err: any) {
    console.error('Update profile error:', err);
    return {
      success: false,
      error: err.message || 'An unexpected error occurred while updating profile.',
    };
  }
}

export async function deleteProfileAction(profileId: string) {
  try {
    const result = await ProfileService.deleteProfile(profileId);
    if (result.success) {
      revalidatePath('/students');
      revalidatePath('/alumni');
      revalidatePath('/dashboard/admin');
    }
    return result;
  } catch (err: any) {
    console.error('Delete profile error:', err);
    return {
      success: false,
      error: err.message || 'An unexpected error occurred while deleting profile.',
    };
  }
}

export async function setLeadershipRoleAction(profileId: string, role: 'CR' | 'ACR' | null) {
  try {
    const result = await ProfileService.setLeadershipRole(profileId, role);
    if (result.success) {
      revalidatePath('/students');
      revalidatePath('/alumni');
      revalidatePath(`/profile/${profileId}`);
      revalidatePath('/dashboard/admin');
    }
    return result;
  } catch (err: any) {
    console.error('Set leadership role error:', err);
    return {
      success: false,
      error: err.message || 'Failed to update leadership role.',
    };
  }
}

export async function setAcademicRankAction(profileId: string, rank: '1st' | '2nd' | '3rd' | null) {
  try {
    const result = await ProfileService.setAcademicRank(profileId, rank);
    if (result.success) {
      revalidatePath('/students');
      revalidatePath('/alumni');
      revalidatePath(`/profile/${profileId}`);
      revalidatePath('/dashboard/admin');
    }
    return result;
  } catch (err: any) {
    console.error('Set academic rank error:', err);
    return {
      success: false,
      error: err.message || 'Failed to update academic rank.',
    };
  }
}
