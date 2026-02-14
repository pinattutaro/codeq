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
        const meta = user.user_metadata || {}
        // GitHubのメタデータ: user_name (GitHub username), full_name, name, avatar_url
        const username = meta.user_name || meta.preferred_username || user.email?.split('@')[0] || 'user'
        const displayName = meta.full_name || meta.name || username
        const avatarUrl = meta.avatar_url

        console.log('GitHub user metadata:', { username, displayName, avatarUrl, meta })

        await prisma.user.upsert({
          where: { supabaseId: user.id },
          update: {
            email: user.email || '',
            // 名前とアバターは初回のみ設定、既存ユーザーの手動設定は上書きしない
          },
          create: {
            supabaseId: user.id,
            email: user.email || '',
            name: username,
            displayName: displayName,
            avatarUrl: avatarUrl,
          },
        })

        // 既存ユーザーでもアバターが未設定の場合は更新
        const existingUser = await prisma.user.findUnique({
          where: { supabaseId: user.id },
        })
        if (existingUser && !existingUser.avatarUrl && avatarUrl) {
          await prisma.user.update({
            where: { supabaseId: user.id },
            data: {
              avatarUrl: avatarUrl,
              displayName: existingUser.displayName || displayName,
            },
          })
        }
      } catch (e) {
        console.error('Failed to sync user profile:', e)
      }
    }
  }

  return NextResponse.redirect(new URL(redirect, requestUrl.origin))
}
