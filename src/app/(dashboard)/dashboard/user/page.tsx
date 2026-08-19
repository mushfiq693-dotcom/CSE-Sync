import { AuthService } from '@/server/services/auth.service';
import { ProfileService } from '@/server/services/profile.service';
import { SessionService } from '@/server/services/session.service';
import { UserDashboardView } from '@/client/components/dashboard/user-dashboard-view';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Member Dashboard | GSTU CSE Directory',
  description: 'Manage and update departmental student and alumni profiles.',
};

export const dynamic = 'force-dynamic';

export default async function UserDashboardPage() {
  let currentUser;
  try {
    currentUser = await AuthService.requireApprovedUser();
  } catch (error) {
    redirect('/login');
  }

  const [profiles, sessions] = await Promise.all([
    ProfileService.getPublicProfiles(),
    SessionService.getSessions(),
  ]);

  return (
    <UserDashboardView
      user={currentUser}
      profiles={profiles}
      sessions={sessions}
    />
  );
}
