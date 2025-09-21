import { NextResponse } from 'next/server'
import { createServerClientSupabase } from '@/lib/supabase/server'

export async function GET() {
  const supabase = createServerClientSupabase()
  const { data: { user }, error } = await supabase.auth.getUser()
  return NextResponse.json({ user, error })
}