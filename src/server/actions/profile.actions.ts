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

    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: 'Image size cannot exceed 5MB.' };
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
      return { success: false, error: uploadError.message };
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
  const rawData: Record<string, any> = {};
  formData.forEach((value, key) => {
    rawData[key] = value === '' ? null : value;
  });

  const validation = profileSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
      error: 'Please fill in all required fields properly.',
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
}

export async function updateProfileAction(profileId: string, prevState: any, formData: FormData) {
  const rawData: Record<string, any> = {};
  formData.forEach((value, key) => {
    rawData[key] = value === '' ? null : value;
  });

  const validation = profileSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
      error: 'Please fill in all required fields properly.',
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
}

export async function deleteProfileAction(profileId: string) {
  const result = await ProfileService.deleteProfile(profileId);
  if (result.success) {
    revalidatePath('/students');
    revalidatePath('/alumni');
    revalidatePath('/dashboard/admin');
  }
  return result;
}
