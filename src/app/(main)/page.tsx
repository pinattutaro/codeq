import { QuestionCard } from '@/components';
import { Search } from 'lucide-react';
import { prisma } from '@/lib/prisma';

// タグカラーのマッピング
const tagColors: Record<string, string> = {
  'React': 'bg-[#61DAFB]/20 text-[#0EA5E9]',
  'JavaScript': 'bg-[#F7DF1E]/20 text-[#B45309]',
  'TypeScript': 'bg-[#3178C6]/20 text-[#2563EB]',
  'Python': 'bg-[#3776AB]/20 text-[#059669]',
  'Next.js': 'bg-[#000000]/10 text-[#1A1A1A]',
  'Node.js': 'bg-[#339933]/20 text-[#059669]',
  'CSS': 'bg-[#1572B6]/20 text-[#2563EB]',
  'HTML': 'bg-[#E34F26]/20 text-[#DC2626]',
};

function getTagColor(tagName: string): string {
  return tagColors[tagName] || 'bg-[#6B7280]/20 text-[#6B7280]';
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) return `${diffMins}分前`;
  if (diffHours < 24) return `${diffHours}時間前`;
  if (diffDays < 7) return `${diffDays}日前`;
  return date.toLocaleDateString('ja-JP');
}

export default async function HomePage() {
  // データベースから質問を取得
  const questionsData = await prisma.question.findMany({
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
      answers: {
        select: {
          isAccepted: true,
        },
      },
      _count: {
        select: {
          answers: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 20,
  });

  // 各質問の投票スコアを計算
  const questionsWithVotes = await Promise.all(
    questionsData.map(async (q) => {
      const voteResult = await prisma.vote.aggregate({
        where: { questionId: q.id },
        _sum: { value: true },
      });
      return {
        id: q.id,
        title: q.title,
        excerpt: q.body.length > 100 ? q.body.substring(0, 100) + '...' : q.body,
        tags: q.tags.map((qt) => ({
          name: qt.tag.name,
          color: qt.tag.color ? `bg-[${qt.tag.color}]/20 text-[${qt.tag.color}]` : getTagColor(qt.tag.name),
        })),
        author: { name: q.author.displayName || q.author.name || 'Unknown' },
        votes: voteResult._sum.value || 0,
        answers: q._count.answers,
        views: q.viewCount,
        createdAt: formatRelativeTime(q.createdAt),
        hasAcceptedAnswer: q.answers.some((a) => a.isAccepted),
      };
    })
  );

  return (
    <div className="p-[1rem] lg:p-[2rem] max-w-4xl">
      {/* Header */}
      <div className="flex flex-col gap-[1rem] lg:flex-row lg:items-center lg:justify-between mb-[1.5rem] lg:mb-[2rem]">
        <h1 className="text-[clamp(1.25rem,3vw,1.875rem)] font-bold font-display text-[#1A1A1A]">最新の質問</h1>
        <div className="flex items-center gap-[0.75rem] bg-white rounded-lg px-[1rem] h-[2.5rem] lg:h-[2.75rem] w-full lg:max-w-[18.75rem] border border-[#E5E7EB]">
          <Search className="w-[1.125rem] h-[1.125rem] text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="質問を検索..."
            className="flex-1 bg-transparent outline-none text-[0.75rem] lg:text-[0.875rem] font-mono text-[#1A1A1A] placeholder:text-[#9CA3AF]"
          />
        </div>
      </div>

      {/* Questions List */}
      <div className="flex flex-col gap-[0.75rem] lg:gap-[1rem]">
        {questionsWithVotes.length > 0 ? (
          questionsWithVotes.map((question) => (
            <QuestionCard key={question.id} {...question} />
          ))
        ) : (
          <div className="text-center py-[3rem]">
            <p className="text-[#6B7280] font-mono">まだ質問がありません</p>
            <p className="text-[#9CA3AF] font-mono text-[0.875rem] mt-[0.5rem]">
              最初の質問を投稿してみましょう！
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
