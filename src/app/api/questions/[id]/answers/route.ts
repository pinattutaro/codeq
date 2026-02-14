import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// 回答を投稿
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: questionId } = await params

  try {
    const { body, authorId } = await request.json()

    if (!authorId) {
      return NextResponse.json(
        { error: 'ログインが必要です' },
        { status: 401 }
      )
    }

    const answer = await prisma.answer.create({
      data: {
        body,
        questionId,
        authorId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
    })

    return NextResponse.json({ answer })
  } catch (error) {
    console.error('Error creating answer:', error)
    return NextResponse.json(
      { error: '回答の投稿に失敗しました' },
      { status: 500 }
    )
  }
}
