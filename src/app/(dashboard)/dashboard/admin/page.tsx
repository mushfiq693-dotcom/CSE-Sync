import { AuthService } from '@/server/services/auth.service';
import { UserService } from '@/server/services/user.service';
import { ProfileService } from '@/server/services/profile.service';
import { SessionService } from '@/server/services/session.service';
import { AdminDashboardView } from '@/client/components/dashboard/admin-dashboard-view';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard | GSTU CSE Directory',
  description: 'Department administrator control panel for member approvals and directory moderation.',
};

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  let adminUser;
  try {
    adminUser = await AuthService.requireAdmin();
  } catch (error) {
    redirect('/login');
  }

  const [pendingUsers, approvedUsers, profiles, sessions] = await Promise.all([
    UserService.getPendingUsers(),
    UserService.getApprovedUsers(),
    ProfileService.getPublicProfiles(),
    SessionService.getSessions(),
  ]);

  return (
    <AdminDashboardView
      adminUser={adminUser}
      pendingUsers={pendingUsers}
      approvedUsers={approvedUsers}
      profiles={profiles}
      sessions={sessions}
    />
  );
}
