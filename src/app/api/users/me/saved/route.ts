import { NextResponse } from 'next/server'
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
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'ユーザーが見つかりません' }, { status: 404 })
    }

    // 保存済み質問を取得
    const savedQuestions = await prisma.savedQuestion.findMany({
      where: { userId: dbUser.id },
      include: {
        question: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                displayName: true,
              },
            },
            tags: {
              include: {
                tag: true,
              },
            },
            answers: {
              select: {
                isAccepted: true,
              },
            },
            _count: {
              select: {
                votes: true,
                answers: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(savedQuestions)
  } catch (error) {
    console.error('Saved questions fetch error:', error)
    return NextResponse.json({ error: '保存済み質問の取得に失敗しました' }, { status: 500 })
  }
}
