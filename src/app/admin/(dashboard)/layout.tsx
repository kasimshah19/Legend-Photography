import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/authorization';
import { logoutAdmin } from '@/app/admin/actions';
import { AdminShell } from '@/components/admin/AdminShell';
import { SocketProvider } from '@/components/admin/SocketProvider';
import { ToastProvider } from '@/components/admin/ToastProvider';
import { RealtimeEventHandler } from '@/components/admin/RealtimeEventHandler';

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

  // Get the session cookie to pass to Socket.IO client for authentication
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session')?.value || '';

  return (
    <SocketProvider sessionToken={sessionToken}>
      <ToastProvider>
        <RealtimeEventHandler />
        <AdminShell user={user} logoutAction={logoutAdmin}>
          {children}
        </AdminShell>
      </ToastProvider>
    </SocketProvider>
  );
}
