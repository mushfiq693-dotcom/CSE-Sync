import { ProfileService } from '@/server/services/profile.service';
import { SessionService } from '@/server/services/session.service';
import { DirectoryView } from '@/client/components/directory/directory-view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Current Students | GSTU CSE Directory',
  description: 'Browse all current undergraduate students in the Department of CSE, GSTU.',
};

export const dynamic = 'force-dynamic';

export default async function StudentsPage() {
  let initialProfiles: any[] = [];
  let sessions: any[] = [];

  try {
    const [profilesData, sessionsData] = await Promise.all([
      ProfileService.getPublicProfiles({ profile_type: 'student' }),
      SessionService.getSessions(),
    ]);
    initialProfiles = profilesData;
    sessions = sessionsData;
  } catch (error) {
    console.error('Failed to load students directory:', error);
  }

  return (
    <DirectoryView
      initialProfiles={initialProfiles}
      sessions={sessions}
      type="student"
      title="Current Students Directory"
      subtitle="Comprehensive list of enrolled undergraduate students in the Department of Computer Science & Engineering, GSTU. Filter by batch or search by name, ID, or roll."
    />
  );
}
