import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// 保存/保存解除
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: questionId } = await params

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

    const userId = dbUser.id

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
