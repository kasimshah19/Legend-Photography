'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { connectMongo } from '@/lib/mongodb';
import AdminUser from '@/lib/models/AdminUser';
import { comparePassword, encryptSession, hashPassword } from '@/lib/auth';

// ─── In-memory rate limiter ──────────────────────────────────────────────────
// Tracks failed login attempts per email. Resets on server restart which is
// acceptable for a small admin panel; a persistent store can be added later.
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

function isRateLimited(email: string): boolean {
  const record = loginAttempts.get(email);
  if (!record) return false;
  if (Date.now() - record.lastAttempt > LOCKOUT_DURATION_MS) {
    loginAttempts.delete(email);
    return false;
  }
  return record.count >= MAX_ATTEMPTS;
}

function recordFailedAttempt(email: string): void {
  const record = loginAttempts.get(email);
  if (record) {
    record.count += 1;
    record.lastAttempt = Date.now();
  } else {
    loginAttempts.set(email, { count: 1, lastAttempt: Date.now() });
  }
}

function clearAttempts(email: string): void {
  loginAttempts.delete(email);
}

// ─── Login Action ────────────────────────────────────────────────────────────
export async function loginAdmin(
  prevState: any,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const email = (formData.get('email') as string)?.trim().toLowerCase();
  const password = formData.get('password') as string;

  // Input validation
  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: 'Please enter a valid email address.' };
  }

  // Rate-limit check
  if (isRateLimited(email)) {
    return { error: 'Too many failed attempts. Please try again later.' };
  }

  try {
    await connectMongo();

    // ── First-run bootstrap ──────────────────────────────────────────────
    const userCount = await AdminUser.countDocuments();
    if (userCount === 0) {
      const initialEmail = process.env.ADMIN_INITIAL_EMAIL?.toLowerCase();
      const initialPassword = process.env.ADMIN_INITIAL_PASSWORD;

      if (
        initialEmail &&
        initialPassword &&
        email === initialEmail &&
        password === initialPassword
      ) {
        const hashedPassword = await hashPassword(password);
        const newUser = await AdminUser.create({
          name: 'Super Admin',
          email: initialEmail,
          passwordHash: hashedPassword,
          role: 'SUPER_ADMIN',
          isActive: true,
          lastLoginAt: new Date(),
        });

        clearAttempts(email);
        await createSession(newUser);
        return { success: true };
      }
    }

    // ── Normal login ─────────────────────────────────────────────────────
    const user = await AdminUser.findOne({ email });

    if (!user || !user.isActive) {
      recordFailedAttempt(email);
      return { error: 'Invalid credentials.' };
    }

    const isPasswordValid = await comparePassword(password, user.passwordHash);

    if (!isPasswordValid) {
      recordFailedAttempt(email);
      return { error: 'Invalid credentials.' };
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    clearAttempts(email);
    await createSession(user);
    return { success: true };
  } catch (error) {
    console.error('Login error:', error);
    return { error: 'An unexpected error occurred. Please try again.' };
  }
}

// ─── Session helper ──────────────────────────────────────────────────────────
async function createSession(user: any) {
  const session = await encryptSession({
    userId: user._id.toString(),
    role: user.role,
    email: user.email,
  });

  const cookieStore = await cookies();
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

// ─── Logout Action ───────────────────────────────────────────────────────────
export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
  redirect('/admin/login');
}
