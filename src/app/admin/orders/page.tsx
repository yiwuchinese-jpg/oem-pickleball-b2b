import { Metadata } from 'next';
import AdminOrdersClient from './AdminOrdersClient';

export const metadata: Metadata = {
  title: 'Admin Dashboard | DJW Pickleball',
  description: 'Manage orders and fulfillment',
};

export default function AdminOrdersPage() {
  return <AdminOrdersClient />;
}
