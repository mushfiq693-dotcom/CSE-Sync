import { ProfileService } from '@/server/services/profile.service';
import { SessionService } from '@/server/services/session.service';
import { DirectoryView } from '@/client/components/directory/directory-view';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Alumni Directory | GSTU CSE Directory',
  description: 'Browse all graduated alumni from the Department of CSE, GSTU.',
};

export const dynamic = 'force-dynamic';

export default async function AlumniPage() {
  let initialProfiles: any[] = [];
  let sessions: any[] = [];

  try {
    const [profilesData, sessionsData] = await Promise.all([
      ProfileService.getPublicProfiles({ profile_type: 'alumni' }),
      SessionService.getSessions(),
    ]);
    initialProfiles = profilesData;
    sessions = sessionsData;
  } catch (error) {
    console.error('Failed to load alumni directory:', error);
  }

  return (
    <DirectoryView
      initialProfiles={initialProfiles}
      sessions={sessions}
      type="alumni"
      title="Graduated Alumni Directory"
      subtitle="Connecting past graduates of the Department of Computer Science & Engineering, GSTU across different sessions, industries, and locations worldwide."
    />
  );
}
