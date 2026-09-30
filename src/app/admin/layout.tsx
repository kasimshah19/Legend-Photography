import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'Admin | Legend Photography',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Admin layout strips the public Footer, WhatsApp button, and Navbar.
          The root layout still provides <html>/<body> and fonts. */}
      {children}
    </>
  );
}
