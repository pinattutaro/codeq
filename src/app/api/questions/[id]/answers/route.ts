import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// 回答を投稿
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

    // PrismaユーザーをSupabase IDで取得または作成
    let dbUser = await prisma.user.findUnique({
      where: { supabaseId: supabaseUser.id },
    })

    if (!dbUser) {
      const meta = supabaseUser.user_metadata || {}
      dbUser = await prisma.user.create({
        data: {
          email: supabaseUser.email!,
          name: meta.user_name || meta.preferred_username || supabaseUser.email?.split('@')[0] || 'User',
          displayName: meta.full_name || meta.name || meta.user_name || supabaseUser.email?.split('@')[0],
          avatarUrl: meta.avatar_url,
          supabaseId: supabaseUser.id,
        },
      })
    }

    const { body } = await request.json()
    const authorId = dbUser.id

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
