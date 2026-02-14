import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// Supabase IDからユーザーを取得・作成
export async function POST(request: NextRequest) {
  try {
    const { supabaseId, email, name } = await request.json()

    // 既存ユーザーを検索
    let user = await prisma.user.findUnique({
      where: { supabaseId },
    })

    if (!user) {
      // emailで検索
      user = await prisma.user.findUnique({
        where: { email },
      })

      if (user) {
        // supabaseIdを更新
        user = await prisma.user.update({
          where: { id: user.id },
          data: { supabaseId },
        })
      } else {
        // 新規作成
        user = await prisma.user.create({
          data: {
            email,
            name,
            displayName: name,
            supabaseId,
          },
        })
      }
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error syncing user:', error)
    return NextResponse.json(
      { error: 'ユーザーの同期に失敗しました' },
      { status: 500 }
    )
  }
}
