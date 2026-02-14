'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { QuestionCard } from '@/components';
import { Bookmark } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SavedQuestion {
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
  React: 'bg-[#F59E0B]/20 text-[#F59E0B]',
  TypeScript: 'bg-[#DC2626]/20 text-[#DC2626]',
  Python: 'bg-[#059669]/20 text-[#059669]',
  'Node.js': 'bg-[#8B5CF6]/20 text-[#8B5CF6]',
  Docker: 'bg-[#06B6D4]/20 text-[#06B6D4]',
  GraphQL: 'bg-[#EC4899]/20 text-[#EC4899]',
  REST: 'bg-[#2563EB]/20 text-[#2563EB]',
  API: 'bg-[#059669]/20 text-[#059669]',
  DevOps: 'bg-[#8B5CF6]/20 text-[#8B5CF6]',
};

export default function SavedPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [savedQuestions, setSavedQuestions] = useState<SavedQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedQuestions = async () => {
      if (!user) return;

      try {
        const response = await fetch('/api/users/me/saved');
        if (response.ok) {
          const data = await response.json();
          setSavedQuestions(
            (data || []).map((item: {
              question: {
                id: string;
                title: string;
                body: string;
                tags: { tag: { name: string } }[];
                author: { displayName?: string; name: string };
                _count: { votes: number; answers: number };
                viewCount: number;
                createdAt: string;
                answers: { isAccepted: boolean }[];
              };
            }) => ({
              id: item.question.id,
              title: item.question.title,
              excerpt: item.question.body.substring(0, 100) + '...',
              tags: (item.question.tags || []).map((t: { tag: { name: string } }) => ({
                name: t.tag.name,
                color: tagColors[t.tag.name] || 'bg-[#6B7280]/20 text-[#6B7280]',
              })),
              author: { name: item.question.author.displayName || item.question.author.name },
              votes: item.question._count?.votes || 0,
              answers: item.question._count?.answers || 0,
              views: item.question.viewCount || 0,
              createdAt: new Date(item.question.createdAt).toLocaleDateString('ja-JP'),
              hasAcceptedAnswer: (item.question.answers || []).some((a: { isAccepted: boolean }) => a.isAccepted),
            }))
          );
        }
      } catch {
        console.error('保存済み質問の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchSavedQuestions();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const handleUnsave = async (questionId: string) => {
    try {
      const response = await fetch(`/api/questions/${questionId}/save`, {
        method: 'POST',
      });

      if (response.ok) {
        setSavedQuestions(savedQuestions.filter((q) => q.id !== questionId));
      }
    } catch {
      console.error('保存の解除に失敗しました');
    }
  };

  if (!authLoading && !user) {
    return (
      <div className="p-[1rem] lg:p-[2rem] max-w-4xl">
        <div className="bg-white rounded-xl p-[2rem] text-center">
          <h2 className="text-[1.25rem] font-bold font-display text-[#1A1A1A] mb-[1rem]">
            ログインが必要です
          </h2>
          <p className="text-[0.875rem] text-[#6B7280] font-mono mb-[1.5rem]">
            保存済みの質問を表示するにはログインしてください
          </p>
          <button
            onClick={() => router.push('/login')}
            className="px-[1.5rem] py-[0.75rem] bg-[#2563EB] text-white rounded-lg text-[0.875rem] font-mono font-semibold hover:bg-[#1D4ED8] transition-colors"
          >
            ログインする
          </button>
        </div>
      </div>
    );
  }

  if (loading || authLoading) {
    return (
      <div className="p-[2rem] flex justify-center">
        <div className="text-[#6B7280] font-mono">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="p-[1rem] lg:p-[2rem] max-w-4xl">
      {/* Header */}
      <div className="flex flex-col gap-[0.25rem] lg:flex-row lg:items-center lg:gap-[0.75rem] mb-[1rem] lg:mb-[2rem]">
        <h1 className="text-[clamp(1.25rem,3vw,1.875rem)] font-bold font-display text-[#1A1A1A]">保存済み</h1>
        <span className="text-[#6B7280] font-mono text-[0.75rem] lg:text-[0.875rem]">{savedQuestions.length}件の質問を保存中</span>
      </div>

      {/* Saved Questions List */}
      {savedQuestions.length === 0 ? (
        <div className="bg-white rounded-xl p-[2rem] text-center">
          <p className="text-[#6B7280] font-mono">保存済みの質問はありません</p>
        </div>
      ) : (
        <div className="flex flex-col gap-[0.75rem] lg:gap-[1rem]">
          {savedQuestions.map((question) => (
            <div key={question.id} className="relative">
              <QuestionCard {...question} />
              <button
                onClick={() => handleUnsave(question.id)}
                className="absolute top-[0.75rem] right-[0.75rem] lg:top-[1rem] lg:right-[1rem] text-[#2563EB] hover:text-[#1D4ED8]"
              >
                <Bookmark className="w-[1.125rem] h-[1.125rem]" fill="#2563EB" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
