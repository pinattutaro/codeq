import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const redirect = requestUrl.searchParams.get('redirect') || '/'

  if (code) {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code)

    // ユーザープロファイルをデータベースに同期
    if (!error && user) {
      try {
        await prisma.user.upsert({
          where: { supabaseId: user.id },
          update: {
            email: user.email || '',
            name: user.user_metadata?.user_name || user.user_metadata?.name || user.email?.split('@')[0],
            displayName: user.user_metadata?.full_name || user.user_metadata?.name,
            avatarUrl: user.user_metadata?.avatar_url,
          },
          create: {
            supabaseId: user.id,
            email: user.email || '',
            name: user.user_metadata?.user_name || user.user_metadata?.name || user.email?.split('@')[0] || 'user',
            displayName: user.user_metadata?.full_name || user.user_metadata?.name,
            avatarUrl: user.user_metadata?.avatar_url,
          },
        })
      } catch (e) {
        console.error('Failed to sync user profile:', e)
      }
    }
  }

  return NextResponse.redirect(new URL(redirect, requestUrl.origin))
}
