import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // タグを作成
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { name: 'JavaScript' },
      update: {},
      create: { name: 'JavaScript', color: '#F7DF1E', description: 'JavaScriptプログラミング言語に関する質問' },
    }),
    prisma.tag.upsert({
      where: { name: 'TypeScript' },
      update: {},
      create: { name: 'TypeScript', color: '#3178C6', description: 'TypeScriptに関する質問' },
    }),
    prisma.tag.upsert({
      where: { name: 'React' },
      update: {},
      create: { name: 'React', color: '#61DAFB', description: 'Reactライブラリに関する質問' },
    }),
    prisma.tag.upsert({
      where: { name: 'Next.js' },
      update: {},
      create: { name: 'Next.js', color: '#000000', description: 'Next.jsフレームワークに関する質問' },
    }),
    prisma.tag.upsert({
      where: { name: 'Node.js' },
      update: {},
      create: { name: 'Node.js', color: '#339933', description: 'Node.jsに関する質問' },
    }),
    prisma.tag.upsert({
      where: { name: 'Python' },
      update: {},
      create: { name: 'Python', color: '#3776AB', description: 'Pythonプログラミング言語に関する質問' },
    }),
    prisma.tag.upsert({
      where: { name: 'CSS' },
      update: {},
      create: { name: 'CSS', color: '#1572B6', description: 'CSSスタイリングに関する質問' },
    }),
    prisma.tag.upsert({
      where: { name: 'HTML' },
      update: {},
      create: { name: 'HTML', color: '#E34F26', description: 'HTMLマークアップに関する質問' },
    }),
    prisma.tag.upsert({
      where: { name: 'SQL' },
      update: {},
      create: { name: 'SQL', color: '#4479A1', description: 'SQLデータベースに関する質問' },
    }),
    prisma.tag.upsert({
      where: { name: 'Git' },
      update: {},
      create: { name: 'Git', color: '#F05032', description: 'Gitバージョン管理に関する質問' },
    }),
  ])

  console.log(`✅ Created ${tags.length} tags`)

  // テストユーザーを作成（開発用）
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'test_user',
      displayName: 'テストユーザー',
      bio: 'CodeQの開発テスト用アカウントです。',
    },
  })

  console.log(`✅ Created test user: ${testUser.email}`)

  // サンプル質問を作成
  const question1 = await prisma.question.upsert({
    where: { id: 'sample-question-1' },
    update: {},
    create: {
      id: 'sample-question-1',
      title: 'ReactでuseStateの値が更新されない問題',
      body: `useStateで状態を更新しても、コンソールログには古い値が表示されます。

\`\`\`javascript
const [count, setCount] = useState(0);

const handleClick = () => {
  setCount(count + 1);
  console.log(count); // 常に古い値が表示される
};
\`\`\`

なぜ更新が反映されないのでしょうか？`,
      authorId: testUser.id,
      viewCount: 156,
    },
  })

  const question2 = await prisma.question.upsert({
    where: { id: 'sample-question-2' },
    update: {},
    create: {
      id: 'sample-question-2',
      title: 'Next.js App RouterでServer Componentからデータを取得する方法',
      body: `Next.js 13以降のApp Routerで、Server Componentからデータベースのデータを取得する最適な方法を教えてください。

特に以下の点が気になっています：
- キャッシュの扱い
- エラーハンドリング
- ローディング状態の表示`,
      authorId: testUser.id,
      viewCount: 234,
    },
  })

  // 質問にタグを関連付け
  await prisma.questionTag.upsert({
    where: { questionId_tagId: { questionId: question1.id, tagId: tags[2].id } },
    update: {},
    create: { questionId: question1.id, tagId: tags[2].id },
  })
  await prisma.questionTag.upsert({
    where: { questionId_tagId: { questionId: question1.id, tagId: tags[0].id } },
    update: {},
    create: { questionId: question1.id, tagId: tags[0].id },
  })
  await prisma.questionTag.upsert({
    where: { questionId_tagId: { questionId: question2.id, tagId: tags[3].id } },
    update: {},
    create: { questionId: question2.id, tagId: tags[3].id },
  })
  await prisma.questionTag.upsert({
    where: { questionId_tagId: { questionId: question2.id, tagId: tags[1].id } },
    update: {},
    create: { questionId: question2.id, tagId: tags[1].id },
  })

  console.log(`✅ Created 2 sample questions with tags`)

  // サンプル回答を作成
  const answer1 = await prisma.answer.upsert({
    where: { id: 'sample-answer-1' },
    update: {},
    create: {
      id: 'sample-answer-1',
      body: `これはReactのsetStateが非同期であるためです。

setStateは即座に状態を更新するのではなく、次のレンダリングサイクルで更新をスケジュールします。

**解決策1: 更新後の値を使用する場合はuseEffectを使う**

\`\`\`javascript
useEffect(() => {
  console.log(count); // 更新後の値が表示される
}, [count]);
\`\`\`

**解決策2: 関数形式でsetStateを使う**

\`\`\`javascript
setCount(prevCount => {
  const newCount = prevCount + 1;
  console.log(newCount);
  return newCount;
});
\`\`\``,
      questionId: question1.id,
      authorId: testUser.id,
      isAccepted: true,
    },
  })

  console.log(`✅ Created sample answer`)

  // サンプル投票を作成
  await prisma.vote.upsert({
    where: { id: 'sample-vote-1' },
    update: {},
    create: {
      id: 'sample-vote-1',
      value: 1,
      userId: testUser.id,
      questionId: question1.id,
    },
  })

  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
