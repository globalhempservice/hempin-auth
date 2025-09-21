'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [nextUrl, setNextUrl] = useState<string>('/')
  const [msg, setMsg] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [working, setWorking] = useState(false)

  // read ?next on mount (avoid useSearchParams SSR warnings)
  useEffect(() => {
    try {
      const u = new URL(window.location.href)
      const n = u.searchParams.get('next') || '/'
      setNextUrl(n)
    } catch {}
  }, [])

  async function sendMagic(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setWorking(true); setMsg(null); setErr(null)

    const origin = window.location.origin
    const cb = new URL(`${origin}/callback`)
    cb.searchParams.set('next', nextUrl)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: cb.toString() }
    })

    setWorking(false)
    if (error) setErr(error.message)
    else setMsg('Check your inbox for a login link.')
  }

  return (
    <main className="min-h-screen grid place-items-center p-6">
      <form onSubmit={sendMagic} className="w-full max-w-sm rounded-xl border border-white/10 bg-white/5 p-5">
        <h1 className="text-lg font-semibold">Sign in</h1>
        <p className="text-sm opacity-70 mt-1">We’ll email you a magic link.</p>
        <input
          type="email"
          required
          placeholder="you@domain.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-4 w-full rounded-md border border-white/15 bg-zinc-900/60 px-3 py-2 outline-none"
        />
        <button
          disabled={working || !email}
          className="mt-3 w-full rounded-md bg-white text-zinc-900 px-4 py-2 text-sm font-medium disabled:opacity-60"
        >
          {working ? 'Sending…' : 'Send magic link'}
        </button>
        {msg && <div className="mt-3 text-emerald-300 text-sm">{msg}</div>}
        {err && <div className="mt-3 text-rose-300 text-sm">{err}</div>}
      </form>
    </main>
  )
}