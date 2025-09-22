// src/app/callback/page.tsx
'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

function safeNext(urlStr: string | null): string | null {
  if (!urlStr) return null;
  try {
    const u = new URL(urlStr);
    if (u.protocol !== 'https:') return null;
    if (!u.hostname.endsWith('.hempin.org')) return null;
    return u.toString();
  } catch {
    return null;
  }
}

export default function AuthCallback() {
  useEffect(() => {
    (async () => {
      const supabase = createClient();

      // 1) Handle both code-exchange and hash-based flows
      const url = new URL(window.location.href);
      const code = url.searchParams.get('code');

      if (code) {
        try { await supabase.auth.exchangeCodeForSession(code); } catch {}
      } else {
        try { await supabase.auth.getSession(); } catch {}
      }

      // Pull tokens from the current client session (or fallback hash)
      let access_token: string | null = null;
      let refresh_token: string | null = null;

      try {
        const { data } = await supabase.auth.getSession();
        access_token = data.session?.access_token ?? null;
        refresh_token = data.session?.refresh_token ?? null;
      } catch {}

      if (!access_token || !refresh_token) {
        const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
        access_token = access_token || hash.get('access_token');
        refresh_token = refresh_token || hash.get('refresh_token');
      }

      // 2) Ask server to set parent-domain cookies for SSO
      if (access_token && refresh_token) {
        try {
          await fetch('/api/auth/finish', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ access_token, refresh_token }),
          });
        } catch {
          // non-blocking
        }
      }

      // 3) Redirect back to the requesting app
      const nextUrl = safeNext(url.searchParams.get('next')) ?? 'https://account.hempin.org/nebula';

      // Clean the URL
      url.searchParams.delete('code');
      url.hash = '';
      window.history.replaceState(null, '', url.toString());

      window.location.replace(nextUrl);
    })();
  }, []);

  return (
    <main className="min-h-screen grid place-items-center p-6">
      <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-sm">
        Finalizing sign-in…
      </div>
    </main>
  );
}