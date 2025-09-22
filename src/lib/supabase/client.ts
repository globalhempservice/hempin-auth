// src/lib/supabase/client.ts
'use client'

import { createBrowserClient as createBrowserClientSSR } from '@supabase/ssr'

export function createClient() {
  return createBrowserClientSSR(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  )
}

// Back-compat alias if anything imports { createBrowserClient } from this path
export const createBrowserClient = createClient