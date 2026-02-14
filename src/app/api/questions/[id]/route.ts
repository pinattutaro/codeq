import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// 質問詳細取得
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    // 閲覧数を増加
    const question = await prisma.question.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            displayName: true,
            avatarUrl: true,
            bio: true,
            createdAt: true,
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
        answers: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                displayName: true,
                avatarUrl: true,
              },
            },
            _count: {
              select: {
                votes: true,
              },
            },
          },
          orderBy: [
            { isAccepted: 'desc' },
            { createdAt: 'asc' },
          ],
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                displayName: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
        _count: {
          select: {
            answers: true,
            votes: true,
          },
        },
      },
    })

    if (!question) {
      return NextResponse.json(
        { error: '質問が見つかりません' },
        { status: 404 }
      )
    }

    // 投票スコアを計算
    const voteResult = await prisma.vote.aggregate({
      where: { questionId: id },
      _sum: { value: true },
    })

    // 各回答の投票スコアを計算
    const answersWithScore = await Promise.all(
      question.answers.map(async (answer) => {
        const answerVoteResult = await prisma.vote.aggregate({
          where: { answerId: answer.id },
          _sum: { value: true },
        })
        return {
          ...answer,
          voteScore: answerVoteResult._sum.value || 0,
        }
      })
    )

    return NextResponse.json({
      question: {
        ...question,
        voteScore: voteResult._sum.value || 0,
        answers: answersWithScore,
      },
    })
  } catch (error) {
    console.error('Error fetching question:', error)
    return NextResponse.json(
      { error: '質問の取得に失敗しました' },
      { status: 500 }
    )
  }
}

// 質問更新
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const { title, body, tags, authorId } = await request.json()

    // 権限チェック
    const existingQuestion = await prisma.question.findUnique({
      where: { id },
      select: { authorId: true },
    })

    if (!existingQuestion) {
      return NextResponse.json(
        { error: '質問が見つかりません' },
        { status: 404 }
      )
    }

    if (existingQuestion.authorId !== authorId) {
      return NextResponse.json(
        { error: '編集権限がありません' },
        { status: 403 }
      )
    }

    // 既存のタグを削除
    await prisma.questionTag.deleteMany({
      where: { questionId: id },
    })

    const question = await prisma.question.update({
      where: { id },
      data: {
        title,
        body,
        tags: {
          create: tags.map((tagName: string) => ({
            tag: {
              connectOrCreate: {
                where: { name: tagName },
                create: { name: tagName },
              },
            },
          })),
        },
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
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    return NextResponse.json({ question })
  } catch (error) {
    console.error('Error updating question:', error)
    return NextResponse.json(
      { error: '質問の更新に失敗しました' },
      { status: 500 }
    )
  }
}

// 質問削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const { authorId } = await request.json()

    // 権限チェック
    const existingQuestion = await prisma.question.findUnique({
      where: { id },
      select: { authorId: true },
    })

    if (!existingQuestion) {
      return NextResponse.json(
        { error: '質問が見つかりません' },
        { status: 404 }
      )
    }

    if (existingQuestion.authorId !== authorId) {
      return NextResponse.json(
        { error: '削除権限がありません' },
        { status: 403 }
      )
    }

    await prisma.question.delete({
      where: { id },
    })

    return NextResponse.json({ message: '質問を削除しました' })
  } catch (error) {
    console.error('Error deleting question:', error)
    return NextResponse.json(
      { error: '質問の削除に失敗しました' },
      { status: 500 }
    )
  }
}
