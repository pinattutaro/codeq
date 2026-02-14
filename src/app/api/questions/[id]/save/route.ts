import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// 保存/保存解除
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: questionId } = await params

  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'ログインが必要です' },
        { status: 401 }
      )
    }

    // 既存の保存を確認
    const existingSave = await prisma.savedQuestion.findUnique({
      where: {
        userId_questionId: {
          userId,
          questionId,
        },
      },
    })

    if (existingSave) {
      // 保存済みなら解除
      await prisma.savedQuestion.delete({
        where: { id: existingSave.id },
      })
      return NextResponse.json({ message: '保存を解除しました', saved: false })
    }

    // 新規保存
    await prisma.savedQuestion.create({
      data: {
        userId,
        questionId,
      },
    })

    return NextResponse.json({ message: '保存しました', saved: true })
  } catch (error) {
    console.error('Error saving question:', error)
    return NextResponse.json(
      { error: '保存に失敗しました' },
      { status: 500 }
    )
  }
}
