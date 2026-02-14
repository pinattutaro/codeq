import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// 投票
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: questionId } = await params

  try {
    const { userId, value } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'ログインが必要です' },
        { status: 401 }
      )
    }

    // 既存の投票を確認
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_questionId: {
          userId,
          questionId,
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
        questionId,
      },
    })

    return NextResponse.json({ message: '投票しました', vote })
  } catch (error) {
    console.error('Error voting:', error)
    return NextResponse.json(
      { error: '投票に失敗しました' },
      { status: 500 }
    )
  }
}
