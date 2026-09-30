import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/authorization';
import { logoutAdmin } from '@/app/admin/actions';
import { AdminShell } from '@/components/admin/AdminShell';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const payload = await getSession();

  if (!payload) {
    redirect('/admin/login');
  }

  // Type assert payload
  const user = {
    email: payload.email as string,
    role: payload.role as string,
  };

  return (
    <AdminShell user={user} logoutAction={logoutAdmin}>
      {children}
    </AdminShell>
  );
}
