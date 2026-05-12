import { Metadata } from 'next';
import CheckoutClient from './CheckoutClient';

export const metadata: Metadata = {
  title: 'Secure Checkout | DJW Pickleball Factory',
  description: 'Complete your wholesale or retail order securely. We offer global DDP shipping.',
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}