import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decryptSession } from '@/lib/auth';

// Paths that don't require authentication
const publicPaths = ['/admin/login'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Apply middleware only to /admin routes
  if (pathname.startsWith('/admin')) {
    const session = request.cookies.get('session')?.value;
    const isPublicPath = publicPaths.includes(pathname);
    
    // Verify session
    const payload = await decryptSession(session);
    
    // If user is not logged in and tries to access a protected route
    if (!payload && !isPublicPath) {
      return NextResponse.redirect(new URL('/admin/login', request.nextUrl));
    }
    
    // If user is already logged in and tries to access the login page
    if (payload && isPublicPath) {
      return NextResponse.redirect(new URL('/admin', request.nextUrl));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
