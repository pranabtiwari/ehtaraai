'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type ChangeEvent, type FormEvent } from 'react';

import { AuthShell } from '../_components/auth-shell';

const inputClassName =
  'mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Registration failed');
        setLoading(false);
        return;
      }
      router.push('/login');
    } catch (error) {
      console.error('Registration failed:', error);
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Create your workspace"
      title="Start with a clean setup."
      description="Create your account once, then move from planning to execution with a sharper interface."
      footerText="Already have an account?"
      footerLink={{ href: '/login', label: 'Sign in' }}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">
            Register
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">
            Create your account
          </h2>
        </div>
        <div className="hidden rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700 sm:block">
          Fast setup
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label
              htmlFor="name"
              className="text-sm font-medium text-slate-700">
              Full name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Amina Rahman"
              autoComplete="name"
              required
              className={inputClassName}
            />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-slate-700">
              Email address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@company.com"
              autoComplete="email"
              required
              className={inputClassName}
            />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              autoComplete="new-password"
              required
              className={inputClassName}
            />
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
            required
          />
          <p>
            I agree to the account terms and understand this workspace is
            designed for secure team access.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70">
          {loading ? 'Creating account...' : 'Create account'}
        </button>

        <p className="text-center text-sm text-slate-500 sm:hidden">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-slate-950">
            Sign in
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
