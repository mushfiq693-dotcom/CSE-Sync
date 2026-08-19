'use server';

// ==============================================================================
// GSTU CSE Directory — Profile Server Actions (Add, Edit, Delete)
// ==============================================================================

import { profileSchema } from '../validations/profile.validation';
import { ProfileService } from '../services/profile.service';
import { revalidatePath } from 'next/cache';

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
