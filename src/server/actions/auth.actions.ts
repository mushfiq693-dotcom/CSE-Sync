'use server';

// ==============================================================================
// GSTU CSE Directory — Authentication Server Actions
// ==============================================================================

import { registerSchema, loginSchema } from '../validations/auth.validation';
import { AuthService } from '../services/auth.service';
import { revalidatePath } from 'next/cache';

export async function registerAction(prevState: any, formData: FormData) {
  const rawData = {
    name: formData.get('name'),
    email: formData.get('email'),
    student_id: formData.get('student_id'),
    password: formData.get('password'),
  };

  const validation = registerSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
      error: 'Please fix the validation errors.',
    };
  }

  const result = await AuthService.signUp(validation.data);
  return result;
}

export async function loginAction(prevState: any, formData: FormData) {
  const rawData = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const validation = loginSchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
      error: 'Please enter valid credentials.',
    };
  }

  const result = await AuthService.signIn(validation.data);
  if (!result.success || !result.profile) {
    return {
      success: false,
      isPending: result.isPending,
      error: result.error || 'Authentication failed',
    };
  }

  revalidatePath('/', 'layout');
  return {
    success: true,
    role: result.profile.role,
  };
}

export async function logoutAction() {
  await AuthService.signOut();
  revalidatePath('/', 'layout');
  return { success: true };
}
