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

  const alumniSessions = sessions.filter((s) => s.sort_order <= 10);

  return (
    <DirectoryView
      initialProfiles={initialProfiles}
      sessions={alumniSessions.length > 0 ? alumniSessions : sessions}
      type="alumni"
      title="Graduated Alumni Directory"
      subtitle="Connecting graduated alumni of the Department of Computer Science & Engineering, GSTU across batches CSE 01 – CSE 10, industries, and locations worldwide."
    />
  );
}
