import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// ユーザーの保存済み質問一覧
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: userId } = await params

  try {
    const savedQuestions = await prisma.savedQuestion.findMany({
      where: { userId },
      include: {
        question: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                displayName: true,
                avatarUrl: true,
              },
            },
            tags: {
              include: {
                tag: {
                  select: {
                    id: true,
                    name: true,
                    color: true,
                  },
                },
              },
            },
            _count: {
              select: {
                answers: true,
                votes: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      savedQuestions: savedQuestions.map((sq) => sq.question),
    })
  } catch (error) {
    console.error('Error fetching saved questions:', error)
    return NextResponse.json(
      { error: '保存済み質問の取得に失敗しました' },
      { status: 500 }
    )
  }
}
