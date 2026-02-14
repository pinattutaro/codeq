import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    }

    // ユーザーを取得
    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
      include: {
        _count: {
          select: {
            questions: true,
            answers: true,
          },
        },
      },
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'ユーザーが見つかりません' }, { status: 404 })
    }

    // 獲得ポイント（投票数）を計算
    const totalVotes = await prisma.vote.count({
      where: {
        OR: [
          { question: { authorId: dbUser.id } },
          { answer: { authorId: dbUser.id } },
        ],
        value: 1,
      },
    })

    // ベストアンサー数を計算
    const bestAnswersCount = await prisma.answer.count({
      where: {
        authorId: dbUser.id,
        isAccepted: true,
      },
    })

    return NextResponse.json({
      ...dbUser,
      totalVotes,
      bestAnswersCount,
    })
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json({ error: 'プロフィールの取得に失敗しました' }, { status: 500 })
  }
}

// プロフィール更新
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
    }

    const { displayName, bio, avatarUrl } = await request.json()

    // ユーザーを更新
    const updatedUser = await prisma.user.update({
      where: { supabaseId: user.id },
      data: {
        ...(displayName !== undefined && { displayName }),
        ...(bio !== undefined && { bio }),
        ...(avatarUrl !== undefined && { avatarUrl }),
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'プロフィールの更新に失敗しました' }, { status: 500 })
  }
}
