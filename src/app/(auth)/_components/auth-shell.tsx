import Link from 'next/link';
import type { ReactNode } from 'react';

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footerText: string;
  footerLink: {
    href: string;
    label: string;
  };
};

const highlights = [
  'Clean, focused workspace for fast access',
  'Secure sign-in flow with simple recovery paths',
  'Designed for desktop and mobile without compromise',
];

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
  footerText,
  footerLink,
}: AuthShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.16),transparent_28%),linear-gradient(180deg,#020617_0%,#0f172a_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-size-[72px_72px] opacity-25" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full gap-8 lg:grid-cols-[1.05fr_0.95fr] xl:gap-12">
          <section className="flex flex-col justify-between rounded-4xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-sky-950/30 backdrop-blur-xl sm:p-10 lg:min-h-[calc(100vh-5rem)] lg:p-12">
            <div>
              <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-sky-400/20 bg-sky-400/10 px-4 py-2 text-sm font-medium text-sky-200">
                <span className="h-2 w-2 rounded-full bg-sky-300 shadow-[0_0_20px_rgba(125,211,252,0.8)]" />
                {eyebrow}
              </div>

              <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                {title}
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
                {description}
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3 lg:mt-0 lg:max-w-2xl">
              {highlights.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-slate-900/50 p-4 text-sm leading-6 text-slate-200">
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="flex items-center justify-center">
            <div className="w-full max-w-lg rounded-4xl border border-white/10 bg-white/90 p-6 text-slate-950 shadow-[0_24px_80px_rgba(2,6,23,0.45)] backdrop-blur-xl sm:p-8">
              {children}

              <p className="mt-8 text-center text-sm text-slate-600">
                {footerText}{' '}
                <Link
                  href={footerLink.href}
                  className="font-semibold text-slate-950 underline decoration-sky-500 decoration-2 underline-offset-4 transition hover:text-sky-700">
                  {footerLink.label}
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
