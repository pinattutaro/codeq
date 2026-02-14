import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // データベースをクリア（順序重要：外部キー制約）
  console.log('🗑️ Clearing database...')
  await prisma.vote.deleteMany()
  await prisma.savedQuestion.deleteMany()
  await prisma.comment.deleteMany()
  await prisma.answer.deleteMany()
  await prisma.questionTag.deleteMany()
  await prisma.question.deleteMany()
  await prisma.tag.deleteMany()
  await prisma.user.deleteMany()
  console.log('✅ Database cleared')

  // 基本タグを作成
  const tags = await Promise.all([
    prisma.tag.create({
      data: { name: 'JavaScript', color: '#F7DF1E', description: 'JavaScriptプログラミング言語に関する質問' },
    }),
    prisma.tag.create({
      data: { name: 'TypeScript', color: '#3178C6', description: 'TypeScriptに関する質問' },
    }),
    prisma.tag.create({
      data: { name: 'React', color: '#61DAFB', description: 'Reactライブラリに関する質問' },
    }),
    prisma.tag.create({
      data: { name: 'Next.js', color: '#000000', description: 'Next.jsフレームワークに関する質問' },
    }),
    prisma.tag.create({
      data: { name: 'Node.js', color: '#339933', description: 'Node.jsに関する質問' },
    }),
    prisma.tag.create({
      data: { name: 'Python', color: '#3776AB', description: 'Pythonプログラミング言語に関する質問' },
    }),
    prisma.tag.create({
      data: { name: 'CSS', color: '#1572B6', description: 'CSSスタイリングに関する質問' },
    }),
    prisma.tag.create({
      data: { name: 'HTML', color: '#E34F26', description: 'HTMLマークアップに関する質問' },
    }),
    prisma.tag.create({
      data: { name: 'SQL', color: '#4479A1', description: 'SQLデータベースに関する質問' },
    }),
    prisma.tag.create({
      data: { name: 'Git', color: '#F05032', description: 'Gitバージョン管理に関する質問' },
    }),
  ])

  console.log(`✅ Created ${tags.length} tags`)
  console.log('🎉 Seeding completed! Database is clean with basic tags.')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
