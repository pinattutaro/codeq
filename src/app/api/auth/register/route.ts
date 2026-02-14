import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { email, password, name } = await request.json()

  const supabase = await createClient()

  // Supabaseでユーザー作成
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  })

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    )
  }

  // Prismaでユーザーレコード作成
  if (data.user) {
    try {
      await prisma.user.create({
        data: {
          email,
          name,
          displayName: name,
          supabaseId: data.user.id,
        },
      })
    } catch (prismaError) {
      console.error('Prisma user creation error:', prismaError)
      // Supabaseユーザーは作成されているので、ユーザーには成功を返す
    }
  }

  return NextResponse.json({ 
    user: data.user,
    message: '確認メールを送信しました。メールを確認してください。'
  })
}
