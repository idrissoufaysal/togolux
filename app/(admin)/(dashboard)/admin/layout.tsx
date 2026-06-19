import * as React from 'react';
import { redirect } from 'next/navigation';
import { createInsForgeServerClient } from '@/lib/insforge-server';
import { AdminDashboardShell } from './AdminDashboardShell';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const client = await createInsForgeServerClient();
  const { data, error } = await client.auth.getCurrentUser();

  if (error || !data?.user) {
    redirect('/admin/login');
  }

  return (
    <AdminDashboardShell userEmail={data.user.email || 'directeur@togolux.com'}>
      {children}
    </AdminDashboardShell>
  );
}
