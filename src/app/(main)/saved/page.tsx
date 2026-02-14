import { QuestionCard } from '@/components';
import { Bookmark } from 'lucide-react';

const savedQuestions = [
  {
    id: '6',
    title: 'REST APIのベストプラクティス2024',
    excerpt: 'RESTful APIを設計する際のベストプラクティスについて、2024年の最新トレンドを踏まえて教えてください。',
    tags: [
      { name: 'REST', color: 'bg-[#2563EB]/20 text-[#2563EB]' },
      { name: 'API', color: 'bg-[#059669]/20 text-[#059669]' },
    ],
    author: { name: 'api_guru' },
    votes: 156,
    answers: 12,
    views: 3456,
    createdAt: '1週間前',
    hasAcceptedAnswer: true,
  },
  {
    id: '7',
    title: 'Docker Composeでのマルチサービス構成',
    excerpt: 'Docker Composeで複数のサービス（MySQL, MongoDB, Redis）を同時に立ち上げる構成について...',
    tags: [
      { name: 'Docker', color: 'bg-[#06B6D4]/20 text-[#06B6D4]' },
      { name: 'DevOps', color: 'bg-[#8B5CF6]/20 text-[#8B5CF6]' },
    ],
    author: { name: 'container_man' },
    votes: 89,
    answers: 6,
    views: 1234,
    createdAt: '2週間前',
    hasAcceptedAnswer: true,
  },
  {
    id: '8',
    title: 'GraphQL vs REST、どちらを選ぶべきか',
    excerpt: '新規プロジェクトでAPIを構築する際、GraphQLとRESTのどちらを選択すべきか判断基準を教えてください。',
    tags: [
      { name: 'GraphQL', color: 'bg-[#EC4899]/20 text-[#EC4899]' },
      { name: 'REST', color: 'bg-[#2563EB]/20 text-[#2563EB]' },
    ],
    author: { name: 'architect_ken' },
    votes: 234,
    answers: 18,
    views: 5678,
    createdAt: '3週間前',
    hasAcceptedAnswer: false,
  },
];

export default function SavedPage() {
  return (
    <div className="p-[1rem] lg:p-[2rem] max-w-4xl">
      {/* Header */}
      <div className="flex flex-col gap-[0.25rem] lg:flex-row lg:items-center lg:gap-[0.75rem] mb-[1rem] lg:mb-[2rem]">
        <h1 className="text-[clamp(1.25rem,3vw,1.875rem)] font-bold font-display text-[#1A1A1A]">保存済み</h1>
        <span className="text-[#6B7280] font-mono text-[0.75rem] lg:text-[0.875rem]">{savedQuestions.length}件の質問を保存中</span>
      </div>

      {/* Saved Questions List */}
      <div className="flex flex-col gap-[0.75rem] lg:gap-[1rem]">
        {savedQuestions.map((question) => (
          <div key={question.id} className="relative">
            <QuestionCard {...question} />
            <button className="absolute top-[0.75rem] right-[0.75rem] lg:top-[1rem] lg:right-[1rem] text-[#2563EB]">
              <Bookmark className="w-[1.125rem] h-[1.125rem]" fill="#2563EB" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
