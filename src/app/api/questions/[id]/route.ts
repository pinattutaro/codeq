import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// 質問詳細取得
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    // 現在のユーザーを取得（任意）
    const supabase = await createClient()
    const { data: { user: supabaseUser } } = await supabase.auth.getUser()
    
    let currentUserId: string | null = null
    if (supabaseUser) {
      const dbUser = await prisma.user.findUnique({
        where: { supabaseId: supabaseUser.id },
      })
      currentUserId = dbUser?.id || null
    }

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

    // 現在のユーザーの質問への投票状態
    let questionUserVote: number | null = null
    if (currentUserId) {
      const userVote = await prisma.vote.findUnique({
        where: {
          userId_questionId: {
            userId: currentUserId,
            questionId: id,
          },
        },
      })
      questionUserVote = userVote?.value || null
    }

    // 保存状態を確認
    let isSaved = false
    if (currentUserId) {
      const saved = await prisma.savedQuestion.findUnique({
        where: {
          userId_questionId: {
            userId: currentUserId,
            questionId: id,
          },
        },
      })
      isSaved = !!saved
    }

    // 各回答の投票スコアとユーザー投票状態を計算
    const answersWithScore = await Promise.all(
      question.answers.map(async (answer: { id: string; body: string; authorId: string; questionId: string; isAccepted: boolean; createdAt: Date; updatedAt: Date; author: { id: string; name: string | null; displayName: string | null; avatarUrl: string | null }; _count: { votes: number } }) => {
        const answerVoteResult = await prisma.vote.aggregate({
          where: { answerId: answer.id },
          _sum: { value: true },
        })
        
        let answerUserVote: number | null = null
        if (currentUserId) {
          const userVote = await prisma.vote.findUnique({
            where: {
              userId_answerId: {
                userId: currentUserId,
                answerId: answer.id,
              },
            },
          })
          answerUserVote = userVote?.value || null
        }
        
        return {
          ...answer,
          voteScore: answerVoteResult._sum.value || 0,
          userVote: answerUserVote,
        }
      })
    )

    // 投票スコア順に並べ替え（高い順）
    const sortedAnswers = answersWithScore.sort((a, b) => b.voteScore - a.voteScore)
    
    // 最も投票が多い回答をベストアンサーとしてマーク（回答が1つ以上あり、最高スコアが0より大きい場合）
    const answersWithBestAnswer = sortedAnswers.map((answer, index) => ({
      ...answer,
      isAccepted: sortedAnswers.length > 0 && sortedAnswers[0].voteScore > 0 && index === 0,
    }))

    return NextResponse.json({
      question: {
        ...question,
        voteScore: voteResult._sum.value || 0,
        userVote: questionUserVote,
        isSaved,
        answers: answersWithBestAnswer,
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
