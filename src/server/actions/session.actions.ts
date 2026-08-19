'use server';

// ==============================================================================
// GSTU CSE Directory — Session Server Actions
// ==============================================================================

import { SessionService } from '../services/session.service';
import { revalidatePath } from 'next/cache';

export async function createSessionAction(formData: FormData) {
  const label = formData.get('label') as string;
  const sort_order = Number(formData.get('sort_order')) || 0;

  if (!label || label.trim() === '') {
    return { success: false, error: 'Session label is required (e.g. CSE 16)' };
  }

  const result = await SessionService.createSession(label, sort_order);
  if (result.success) {
    revalidatePath('/students');
    revalidatePath('/alumni');
    revalidatePath('/dashboard/user');
    revalidatePath('/dashboard/admin');
  }

  return result;
}
