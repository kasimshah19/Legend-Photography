'use client';

import { usePathname } from 'next/navigation';

/**
 * Conditionally renders children only on non-admin routes.
 * Used to hide public-site chrome (Footer, WhatsApp) from admin pages
 * without forcing the root layout to become dynamic.
 */
export function PublicOnly({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;
  return <>{children}</>;
}
