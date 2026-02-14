import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// ユーザー情報取得
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        displayName: true,
        email: true,
        avatarUrl: true,
        bio: true,
        createdAt: true,
        _count: {
          select: {
            questions: true,
            answers: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'ユーザーが見つかりません' },
        { status: 404 }
      )
    }

    // ベストアンサー数を計算
    const bestAnswerCount = await prisma.answer.count({
      where: {
        authorId: id,
        isAccepted: true,
      },
    })

    return NextResponse.json({
      user: {
        ...user,
        bestAnswerCount,
      },
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'ユーザー情報の取得に失敗しました' },
      { status: 500 }
    )
  }
}

// ユーザー情報更新
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const { name, displayName, bio, avatarUrl, currentUserId } = await request.json()

    if (currentUserId !== id) {
      return NextResponse.json(
        { error: '更新権限がありません' },
        { status: 403 }
      )
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        name,
        displayName,
        bio,
        avatarUrl,
      },
      select: {
        id: true,
        name: true,
        displayName: true,
        email: true,
        avatarUrl: true,
        bio: true,
      },
    })

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'ユーザー情報の更新に失敗しました' },
      { status: 500 }
    )
  }
}
