'use server';

// ==============================================================================
// GSTU CSE Directory — Admin Server Actions
// ==============================================================================

import { UserService } from '../services/user.service';
import { revalidatePath } from 'next/cache';
import type { UserRole } from '../db/schema.types';

export async function approveUserAction(userId: string) {
  const result = await UserService.approveUser(userId);
  if (result.success) {
    revalidatePath('/dashboard/admin');
  }
  return result;
}

export async function rejectUserAction(userId: string) {
  const result = await UserService.rejectUser(userId);
  if (result.success) {
    revalidatePath('/dashboard/admin');
  }
  return result;
}

export async function updateUserRoleAction(userId: string, newRole: UserRole) {
  const result = await UserService.updateUserRole(userId, newRole);
  if (result.success) {
    revalidatePath('/dashboard/admin');
  }
  return result;
}
