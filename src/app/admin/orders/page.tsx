import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import AdminOrdersClient from './AdminOrdersClient';

export const metadata: Metadata = {
  title: 'Admin Dashboard | DJW Pickleball',
  description: 'Manage orders and fulfillment',
  robots: { index: false, follow: false },
};

export default async function AdminOrdersPage() {
  // ✅ 服务端鉴权：在渲染任何内容之前先验证身份
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

  // 未登录或不是管理员 → 直接重定向，不渲染任何内容
  if (!user || !ADMIN_EMAIL || user.email !== ADMIN_EMAIL) {
    redirect('/login');
  }

  return <AdminOrdersClient />;
}
