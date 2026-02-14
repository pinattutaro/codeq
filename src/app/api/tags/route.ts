import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// タグ一覧取得
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const search = searchParams.get('search')
  const limit = parseInt(searchParams.get('limit') || '20')

  try {
    const where: any = {}

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      }
    }

    const tags = await prisma.tag.findMany({
      where,
      include: {
        _count: {
          select: {
            questions: true,
          },
        },
      },
      orderBy: {
        questions: {
          _count: 'desc',
        },
      },
      take: limit,
    })

    return NextResponse.json({ tags })
  } catch (error) {
    console.error('Error fetching tags:', error)
    return NextResponse.json(
      { error: 'タグの取得に失敗しました' },
      { status: 500 }
    )
  }
}
