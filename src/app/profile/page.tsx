import ProfileClient from './ProfileClient';

export const metadata = {
  title: 'Profile - DJW Pickleball',
  description: 'Manage your account and view orders.',
  robots: { index: false, follow: false },
};

export default function ProfilePage() {
  return <ProfileClient />;
}
