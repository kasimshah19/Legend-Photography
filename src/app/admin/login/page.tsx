'use client';

import { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAdmin } from '../actions';
import { Eye, EyeOff } from 'lucide-react';

const initialState: { error?: string; success?: boolean } = {
  error: '',
  success: false,
};

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAdmin, initialState);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (state?.success) {
      router.push('/admin');
    }
  }, [state?.success, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md bg-card p-8 rounded-lg shadow-lg border border-border">
        <h1 className="text-2xl font-serif text-foreground mb-6 text-center">Legend Photography Admin</h1>
        
        <form action={formAction} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-muted mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full bg-background border border-border rounded-md px-4 py-2 text-foreground focus:outline-none focus:border-accent"
              placeholder="admin@legend.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-muted mb-2" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className="w-full bg-background border border-border rounded-md px-4 py-2 pr-10 text-foreground focus:outline-none focus:border-accent"
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted hover:text-foreground transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {state?.error && (
            <p className="text-red-500 text-sm mt-2">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-foreground text-background font-medium py-3 rounded-md hover:bg-foreground/90 transition-colors disabled:opacity-50"
          >
            {isPending ? 'Authenticating...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
