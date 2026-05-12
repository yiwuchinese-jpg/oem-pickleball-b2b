import LoginClient from './LoginClient';

export const metadata = {
  title: 'Login - DJW Pickleball',
  description: 'Login or create an account to manage your orders and profile.',
};

export default function LoginPage() {
  const adminEmail = process.env.ADMIN_EMAIL || 'buydiscoball@gmail.com';
  return <LoginClient adminEmail={adminEmail} />;
}
