'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { QuestionCard } from '@/components';
import { Search } from 'lucide-react';

interface Tag {
  name: string;
  color: string;
  count: number;
}

interface Question {
  id: string;
  title: string;
  excerpt: string;
  tags: { name: string; color: string }[];
  author: { name: string };
  votes: number;
  answers: number;
  views: number;
  createdAt: string;
  hasAcceptedAnswer: boolean;
}

const tagColors: Record<string, string> = {
  JavaScript: 'bg-[#2563EB]/20 text-[#2563EB]',
  Python: 'bg-[#059669]/20 text-[#059669]',
  React: 'bg-[#F59E0B]/20 text-[#F59E0B]',
  TypeScript: 'bg-[#DC2626]/20 text-[#DC2626]',
  'Node.js': 'bg-[#8B5CF6]/20 text-[#8B5CF6]',
  Docker: 'bg-[#06B6D4]/20 text-[#06B6D4]',
  GraphQL: 'bg-[#EC4899]/20 text-[#EC4899]',
  SQL: 'bg-[#6B7280]/20 text-[#6B7280]',
};

const filters = ['すべて', 'トレンド', '新着', '未回答'];

function ExploreContent() {
  const searchParams = useSearchParams();
  const initialTag = searchParams.get('tag') || '';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState(0);
  const [selectedTag, setSelectedTag] = useState(initialTag);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [popularTags, setPopularTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch('/api/tags');
        if (response.ok) {
          const result = await response.json();
          const data = result.tags || result;
          setPopularTags(
            (Array.isArray(data) ? data : []).slice(0, 8).map((tag: { name: string; _count?: { questions: number } }) => ({
              name: tag.name,
              color: tagColors[tag.name] || 'bg-[#6B7280]/20 text-[#6B7280]',
              count: tag._count?.questions || 0,
            }))
          );
        }
      } catch {
        console.error('タグの取得に失敗しました');
      }
    };

    fetchTags();
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (selectedTag) params.append('tag', selectedTag);
        if (activeFilter === 2) params.append('sort', 'newest');
        if (activeFilter === 3) params.append('unanswered', 'true');

        const response = await fetch(`/api/questions?${params.toString()}`);
        if (response.ok) {
          const data = await response.json();
          setQuestions(
            (data.questions || []).map((q: {
              id: string;
              title: string;
              body: string;
              tags: { tag: { name: string } }[];
              author: { displayName?: string; name: string };
              _count: { votes: number; answers: number };
              viewCount: number;
              voteScore: number;
              createdAt: string;
              answers?: { isAccepted: boolean }[];
            }) => ({
              id: q.id,
              title: q.title,
              excerpt: q.body.substring(0, 100) + '...',
              tags: (q.tags || []).map((t: { tag: { name: string } }) => ({
                name: t.tag.name,
                color: tagColors[t.tag.name] || 'bg-[#6B7280]/20 text-[#6B7280]',
              })),
              author: { name: q.author.displayName || q.author.name },
              votes: q.voteScore || 0,
              answers: q._count?.answers || 0,
              views: q.viewCount || 0,
              createdAt: new Date(q.createdAt).toLocaleDateString('ja-JP'),
              hasAcceptedAnswer: (q.answers || []).some((a: { isAccepted: boolean }) => a.isAccepted),
            }))
          );
        }
      } catch {
        console.error('質問の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [searchQuery, activeFilter, selectedTag]);

  const handleTagClick = (tagName: string) => {
    setSelectedTag(selectedTag === tagName ? '' : tagName);
  };

  return (
    <div className="p-[1rem] lg:p-[2rem] max-w-4xl">
      {/* Header */}
      <div className="flex flex-col gap-[1rem] lg:flex-row lg:items-center lg:justify-between mb-[1rem] lg:mb-[1.5rem]">
        <h1 className="text-[clamp(1.25rem,3vw,1.875rem)] font-bold font-display text-[#1A1A1A]">探索</h1>
        <div className="flex items-center gap-[0.75rem] bg-white rounded-lg px-[1rem] h-[2.5rem] lg:h-[2.75rem] w-full lg:max-w-[25rem] border border-[#E5E7EB]">
          <Search className="w-[1.125rem] h-[1.125rem] text-[#9CA3AF]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
            onClick={() => setActiveFilter(index)}
            className={`px-[1rem] lg:px-[1.25rem] py-[0.5rem] lg:py-[0.625rem] rounded-lg text-[0.75rem] lg:text-[0.875rem] font-mono transition-colors whitespace-nowrap ${
              index === activeFilter
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
          {popularTags.map((tag) => (
            <button
              key={tag.name}
              onClick={() => handleTagClick(tag.name)}
              className={`flex items-center gap-[0.375rem] lg:gap-[0.5rem] px-[0.75rem] lg:px-[1rem] py-[0.5rem] lg:py-[0.625rem] rounded-lg text-[0.75rem] lg:text-[0.875rem] font-mono font-semibold transition-all ${
                selectedTag === tag.name
                  ? 'ring-2 ring-[#2563EB] ring-offset-2'
                  : ''
              } ${tag.color}`}
            >
              {tag.name}
              <span className="opacity-60 hidden lg:inline">{tag.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Questions List */}
      {loading ? (
        <div className="flex justify-center py-[2rem]">
          <div className="text-[#6B7280] font-mono">読み込み中...</div>
        </div>
      ) : questions.length === 0 ? (
        <div className="bg-white rounded-xl p-[2rem] text-center">
          <p className="text-[#6B7280] font-mono">質問が見つかりませんでした</p>
        </div>
      ) : (
        <div className="flex flex-col gap-[0.75rem] lg:gap-[1rem]">
          {questions.map((question) => (
            <QuestionCard key={question.id} {...question} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={
      <div className="p-[2rem] flex justify-center">
        <div className="text-[#6B7280] font-mono">読み込み中...</div>
      </div>
    }>
      <ExploreContent />
    </Suspense>
  );
}
