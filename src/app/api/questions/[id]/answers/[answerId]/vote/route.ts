import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// 回答への投票
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; answerId: string }> }
) {
  const { answerId } = await params

  try {
    const supabase = await createClient()
    const { data: { user: supabaseUser } } = await supabase.auth.getUser()

    if (!supabaseUser) {
      return NextResponse.json(
        { error: 'ログインが必要です' },
        { status: 401 }
      )
    }

    // PrismaユーザーをSupabase IDで取得
    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: supabaseUser.id },
    })

    if (!dbUser) {
      return NextResponse.json(
        { error: 'ユーザーが見つかりません' },
        { status: 404 }
      )
    }

    const { value } = await request.json()
    const userId = dbUser.id

    // 既存の投票を確認
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_answerId: {
          userId,
          answerId,
        },
      },
    })

    if (existingVote) {
      if (existingVote.value === value) {
        // 同じ投票の場合は取り消し
        await prisma.vote.delete({
          where: { id: existingVote.id },
        })
        return NextResponse.json({ message: '投票を取り消しました', vote: null })
      } else {
        // 違う投票の場合は更新
        const vote = await prisma.vote.update({
          where: { id: existingVote.id },
          data: { value },
        })
        return NextResponse.json({ message: '投票を更新しました', vote })
      }
    }

    // 新規投票
    const vote = await prisma.vote.create({
      data: {
        value,
        userId,
        answerId,
      },
    })

    return NextResponse.json({ message: '投票しました', vote })
  } catch (error) {
    console.error('Error voting on answer:', error)
    return NextResponse.json(
      { error: '投票に失敗しました' },
      { status: 500 }
    )
  }
}
