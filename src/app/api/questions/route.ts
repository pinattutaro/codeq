import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// 質問一覧取得
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const tag = searchParams.get('tag')
  const search = searchParams.get('search')
  const sort = searchParams.get('sort') || 'newest'

  const skip = (page - 1) * limit

  const where: any = {}

  if (tag) {
    where.tags = {
      some: {
        tag: {
          name: tag,
        },
      },
    }
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { body: { contains: search, mode: 'insensitive' } },
    ]
  }

  const orderBy: any = sort === 'newest' 
    ? { createdAt: 'desc' }
    : sort === 'popular'
    ? { viewCount: 'desc' }
    : { createdAt: 'desc' }

  try {
    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where,
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
        orderBy,
        skip,
        take: limit,
      }),
      prisma.question.count({ where }),
    ])

    // 各質問の投票スコアを計算
    const questionsWithScore = await Promise.all(
      questions.map(async (q) => {
        const voteResult = await prisma.vote.aggregate({
          where: { questionId: q.id },
          _sum: { value: true },
        })
        return {
          ...q,
          voteScore: voteResult._sum.value || 0,
        }
      })
    )

    return NextResponse.json({
      questions: questionsWithScore,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching questions:', error)
    return NextResponse.json(
      { error: '質問の取得に失敗しました' },
      { status: 500 }
    )
  }
}

// 質問作成
export async function POST(request: NextRequest) {
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
      // ユーザーが存在しない場合は作成
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

    const { title, body, tags = [] } = await request.json()

    const question = await prisma.question.create({
      data: {
        title,
        body,
        authorId: dbUser.id,
        tags: tags.length > 0 ? {
          create: tags.map((tagName: string) => ({
            tag: {
              connectOrCreate: {
                where: { name: tagName },
                create: { name: tagName },
              },
            },
          })),
        } : undefined,
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

    return NextResponse.json({ id: question.id, question })
  } catch (error) {
    console.error('Error creating question:', error)
    return NextResponse.json(
      { error: '質問の作成に失敗しました' },
      { status: 500 }
    )
  }
}
