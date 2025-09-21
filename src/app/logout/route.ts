import { NextResponse } from 'next/server'
import { createServerClientSupabase } from '@/lib/supabase/server'

export async function GET(req: Request) {
  const supabase = createServerClientSupabase()
  await supabase.auth.signOut().catch(() => {})
  const url = new URL(req.url)
  const next = url.searchParams.get('next') || 'https://auth.hempin.org'
  return NextResponse.redirect(new URL(next))
}