'use server';

import { cookies } from 'next/headers';
import { decryptSession, SessionPayload } from '@/lib/auth';

export type AuthRole = 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR';

/**
 * Verify the current request is from an authenticated, active admin user.
 * Optionally restrict to specific roles.
 *
 * Usage in any Server Action or Route Handler:
 *   const session = await requireAuth();                   // any authenticated user
 *   const session = await requireAuth(['SUPER_ADMIN']);     // only SUPER_ADMIN
 *
 * Returns the SessionPayload on success, or throws a structured error.
 */
export async function requireAuth(
  allowedRoles?: AuthRole[]
): Promise<SessionPayload> {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;

  if (!token) {
    throw new Error('UNAUTHORIZED');
  }

  const payload = await decryptSession(token);

  if (!payload || !payload.userId) {
    throw new Error('UNAUTHORIZED');
  }

  // Verify against DB to catch deactivated users or changed roles mid-session
  const { connectMongo } = await import('@/lib/mongodb');
  const AdminUser = (await import('@/lib/models/AdminUser')).default;
  
  await connectMongo();
  const user = await AdminUser.findById(payload.userId).lean();

  if (!user || !user.isActive) {
    throw new Error('UNAUTHORIZED');
  }

  // Use the freshest role from DB
  const currentRole = user.role as AuthRole;

  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(currentRole)) {
      throw new Error('FORBIDDEN');
    }
  }

  return {
    ...payload,
    role: currentRole, // overwrite token role with DB role
  };
}

/**
 * Non-throwing version: returns the session or null.
 * Useful when you want to check auth without redirecting.
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;
  if (!token) return null;
  
  const payload = await decryptSession(token);
  if (!payload || !payload.userId) return null;

  try {
    const { connectMongo } = await import('@/lib/mongodb');
    const AdminUser = (await import('@/lib/models/AdminUser')).default;
    
    await connectMongo();
    const user = await AdminUser.findById(payload.userId).lean();
    
    if (!user || !user.isActive) return null;

    return {
      ...payload,
      role: user.role, // freshest role
    };
  } catch (error) {
    console.error("getSession DB verification failed", error);
    return null;
  }
}
