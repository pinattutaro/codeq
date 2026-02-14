import { QuestionCard } from '@/components';
import { Search } from 'lucide-react';

const popularTags = [
  { name: 'JavaScript', color: 'bg-[#2563EB]/20 text-[#2563EB]', count: '4,892' },
  { name: 'Python', color: 'bg-[#059669]/20 text-[#059669]', count: '3,456' },
  { name: 'React', color: 'bg-[#F59E0B]/20 text-[#F59E0B]', count: '2,789' },
  { name: 'TypeScript', color: 'bg-[#DC2626]/20 text-[#DC2626]', count: '2,341' },
  { name: 'Node.js', color: 'bg-[#8B5CF6]/20 text-[#8B5CF6]', count: '1,892' },
  { name: 'Docker', color: 'bg-[#06B6D4]/20 text-[#06B6D4]', count: '1,567' },
  { name: 'GraphQL', color: 'bg-[#EC4899]/20 text-[#EC4899]', count: '1,234' },
  { name: 'SQL', color: 'bg-[#6B7280]/20 text-[#6B7280]', count: '1,102' },
];

const filters = ['すべて', 'トレンド', '新着', '未回答'];

const questions = [
  {
    id: '3',
    title: 'JavaScriptでのPromiseチェーンのベストプラクティス',
    excerpt: '複数の非同期処理を連鎖させる際、async/awaitとPromise.allのどちらを使うべきでしょうか？',
    tags: [
      { name: 'JavaScript', color: 'bg-[#2563EB]/20 text-[#2563EB]' },
      { name: 'async', color: 'bg-[#6B7280]/20 text-[#6B7280]' },
    ],
    author: { name: 'js_master' },
    votes: 42,
    answers: 8,
    views: 1245,
    createdAt: '2時間前',
    hasAcceptedAnswer: true,
  },
  {
    id: '4',
    title: 'Pythonでのメモリリーク検出方法',
    excerpt: '長時間稼働するPythonアプリケーションでメモリリークを特定・解決する方法を教えてください。',
    tags: [
      { name: 'Python', color: 'bg-[#059669]/20 text-[#059669]' },
      { name: 'memory', color: 'bg-[#DC2626]/20 text-[#DC2626]' },
    ],
    author: { name: 'py_dev' },
    votes: 28,
    answers: 4,
    views: 892,
    createdAt: '5時間前',
    hasAcceptedAnswer: false,
  },
  {
    id: '5',
    title: 'React Hooksで無限ループを回避する方法',
    excerpt: 'useEffectの依存配列を正しく設定してしまいます。無限ループを防ぐ方法を教えてください。',
    tags: [
      { name: 'React', color: 'bg-[#F59E0B]/20 text-[#F59E0B]' },
      { name: 'Hooks', color: 'bg-[#2563EB]/20 text-[#2563EB]' },
    ],
    author: { name: 'react_lover' },
    votes: 8,
    answers: 3,
    views: 456,
    createdAt: '1日前',
    hasAcceptedAnswer: true,
  },
];

export default function ExplorePage() {
  return (
    <div className="p-[1rem] lg:p-[2rem] max-w-4xl">
      {/* Header */}
      <div className="flex flex-col gap-[1rem] lg:flex-row lg:items-center lg:justify-between mb-[1rem] lg:mb-[1.5rem]">
        <h1 className="text-[clamp(1.25rem,3vw,1.875rem)] font-bold font-display text-[#1A1A1A]">探索</h1>
        <div className="flex items-center gap-[0.75rem] bg-white rounded-lg px-[1rem] h-[2.5rem] lg:h-[2.75rem] w-full lg:max-w-[25rem] border border-[#E5E7EB]">
          <Search className="w-[1.125rem] h-[1.125rem] text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="キーワードで検索..."
            className="flex-1 bg-transparent outline-none text-[0.75rem] lg:text-[0.875rem] font-mono text-[#1A1A1A] placeholder:text-[#9CA3AF]"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-[0.5rem] lg:gap-[0.75rem] mb-[1rem] lg:mb-[1.5rem] overflow-x-auto pb-[0.5rem]">
        {filters.map((filter, index) => (
          <button
            key={filter}
            className={`px-[1rem] lg:px-[1.25rem] py-[0.5rem] lg:py-[0.625rem] rounded-lg text-[0.75rem] lg:text-[0.875rem] font-mono transition-colors whitespace-nowrap ${
              index === 0
                ? 'bg-[#2563EB] text-white font-semibold'
                : 'bg-white text-[#666666] hover:bg-gray-50'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Popular Tags Section */}
      <div className="mb-[1rem] lg:mb-[1.5rem]">
        <h2 className="text-[clamp(1rem,2vw,1.25rem)] font-bold font-display text-[#1A1A1A] mb-[0.75rem] lg:mb-[1rem]">人気のタグ</h2>
        <div className="flex flex-wrap gap-[0.5rem] lg:gap-[0.75rem]">
          {popularTags.slice(0, 6).map((tag) => (
            <button
              key={tag.name}
              className={`flex items-center gap-[0.375rem] lg:gap-[0.5rem] px-[0.75rem] lg:px-[1rem] py-[0.5rem] lg:py-[0.625rem] rounded-lg text-[0.75rem] lg:text-[0.875rem] font-mono font-semibold ${tag.color}`}
            >
              {tag.name}
              <span className="opacity-60 hidden lg:inline">{tag.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Questions List */}
      <div className="flex flex-col gap-[0.75rem] lg:gap-[1rem]">
        {questions.map((question) => (
          <QuestionCard key={question.id} {...question} />
        ))}
      </div>
    </div>
  );
}
