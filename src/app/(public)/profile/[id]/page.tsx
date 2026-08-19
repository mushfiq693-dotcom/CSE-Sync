import { ProfileService } from '@/server/services/profile.service';
import { ProfileDetailView } from '@/client/components/profile/profile-detail-view';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface ProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { id } = await params;
  const profile = await ProfileService.getProfileById(id);

  if (!profile) {
    return {
      title: 'Profile Not Found | GSTU CSE Directory',
    };
  }

  return {
    title: `${profile.full_name} | GSTU CSE Directory`,
    description: `Academic profile of ${profile.full_name} (${profile.student_id}) in the Department of CSE, GSTU.`,
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;
  const profile = await ProfileService.getProfileById(id);

  if (!profile) {
    notFound();
  }

  return <ProfileDetailView profile={profile} />;
}
