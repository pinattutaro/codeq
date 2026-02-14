'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronUp, ChevronDown, Check, MessageSquare, ArrowLeft, Bookmark } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface Tag {
  name: string;
  color: string;
}

interface Author {
  id: string;
  name: string;
  avatarUrl?: string;
}

interface Answer {
  id: string;
  body: string;
  author: Author;
  votes: number;
  createdAt: string;
  isAccepted: boolean;
  userVote?: number;
}

interface Question {
  id: string;
  title: string;
  body: string;
  tags: Tag[];
  author: Author;
  votes: number;
  createdAt: string;
  userVote?: number;
  isSaved?: boolean;
}

const tagColors: Record<string, string> = {
  JavaScript: 'bg-[#2563EB]/20 text-[#2563EB]',
  React: 'bg-[#F59E0B]/20 text-[#F59E0B]',
  TypeScript: 'bg-[#DC2626]/20 text-[#DC2626]',
  Python: 'bg-[#059669]/20 text-[#059669]',
  'Node.js': 'bg-[#8B5CF6]/20 text-[#8B5CF6]',
};

export default function QuestionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [answerBody, setAnswerBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await fetch(`/api/questions/${params.id}`);
        if (!response.ok) {
          throw new Error('質問が見つかりませんでした');
        }
        const data = await response.json();
        setQuestion({
          id: data.id,
          title: data.title,
          body: data.body,
          tags: data.tags.map((t: { tag: { name: string } }) => ({
            name: t.tag.name,
            color: tagColors[t.tag.name] || 'bg-[#6B7280]/20 text-[#6B7280]',
          })),
          author: {
            id: data.author.id,
            name: data.author.displayName || data.author.username,
            avatarUrl: data.author.avatarUrl,
          },
          votes: data._count?.votes || 0,
          createdAt: new Date(data.createdAt).toLocaleDateString('ja-JP'),
          userVote: data.userVote,
          isSaved: data.isSaved,
        });
        setAnswers(
          data.answers?.map((a: {
            id: string;
            body: string;
            author: { id: string; displayName?: string; username: string; avatarUrl?: string };
            _count?: { votes: number };
            createdAt: string;
            isAccepted: boolean;
            userVote?: number;
          }) => ({
            id: a.id,
            body: a.body,
            author: {
              id: a.author.id,
              name: a.author.displayName || a.author.username,
              avatarUrl: a.author.avatarUrl,
            },
            votes: a._count?.votes || 0,
            createdAt: new Date(a.createdAt).toLocaleDateString('ja-JP'),
            isAccepted: a.isAccepted,
            userVote: a.userVote,
          })) || []
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'エラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchQuestion();
    }
  }, [params.id]);

  const handleVote = async (value: number, type: 'question' | 'answer', answerId?: string) => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      const url = type === 'question'
        ? `/api/questions/${params.id}/vote`
        : `/api/questions/${params.id}/answers/${answerId}/vote`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value }),
      });

      if (response.ok) {
        // 再取得
        const refreshResponse = await fetch(`/api/questions/${params.id}`);
        const data = await refreshResponse.json();
        setQuestion(prev => prev ? { ...prev, votes: data._count?.votes || 0, userVote: data.userVote } : null);
      }
    } catch {
      console.error('投票に失敗しました');
    }
  };

  const handleSave = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch(`/api/questions/${params.id}/save`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        setQuestion(prev => prev ? { ...prev, isSaved: data.saved } : null);
      }
    } catch {
      console.error('保存に失敗しました');
    }
  };

  const handleSubmitAnswer = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!answerBody.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/questions/${params.id}/answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: answerBody.trim() }),
      });

      if (response.ok) {
        setAnswerBody('');
        // 再取得
        const refreshResponse = await fetch(`/api/questions/${params.id}`);
        const data = await refreshResponse.json();
        setAnswers(
          data.answers?.map((a: {
            id: string;
            body: string;
            author: { id: string; displayName?: string; username: string; avatarUrl?: string };
            _count?: { votes: number };
            createdAt: string;
            isAccepted: boolean;
          }) => ({
            id: a.id,
            body: a.body,
            author: {
              id: a.author.id,
              name: a.author.displayName || a.author.username,
            },
            votes: a._count?.votes || 0,
            createdAt: new Date(a.createdAt).toLocaleDateString('ja-JP'),
            isAccepted: a.isAccepted,
          })) || []
        );
      }
    } catch {
      console.error('回答の投稿に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-[2rem] flex justify-center">
        <div className="text-[#6B7280] font-mono">読み込み中...</div>
      </div>
    );
  }

  if (error || !question) {
    return (
      <div className="p-[2rem]">
        <div className="bg-[#FEE2E2] text-[#DC2626] px-[1rem] py-[0.75rem] rounded-lg text-[0.875rem] font-mono">
          {error || '質問が見つかりませんでした'}
        </div>
      </div>
    );
  }

  return (
    <div className="p-[1rem] lg:p-[2rem] max-w-4xl">
      {/* Mobile Back Button */}
      <Link href="/" className="lg:hidden flex items-center gap-[0.5rem] text-[#6B7280] mb-[1rem] text-[0.875rem] font-mono">
        <ArrowLeft className="w-[1.125rem] h-[1.125rem]" />
        戻る
      </Link>

      {/* Question */}
      <div className="flex gap-[0.75rem] lg:gap-[1rem] mb-[1.5rem] lg:mb-[2rem]">
        {/* Vote */}
        <div className="flex flex-col items-center gap-[0.25rem] lg:gap-[0.5rem]">
          <button
            onClick={() => handleVote(1, 'question')}
            className={`${question.userVote === 1 ? 'text-[#2563EB]' : 'text-[#9CA3AF]'} hover:text-[#2563EB]`}
          >
            <ChevronUp className="w-[1.5rem] h-[1.5rem] lg:w-[2rem] lg:h-[2rem]" />
          </button>
          <span className="text-[1.125rem] lg:text-[1.25rem] font-bold text-[#1A1A1A]">{question.votes}</span>
          <button
            onClick={() => handleVote(-1, 'question')}
            className={`${question.userVote === -1 ? 'text-[#DC2626]' : 'text-[#9CA3AF]'} hover:text-[#DC2626]`}
          >
            <ChevronDown className="w-[1.5rem] h-[1.5rem] lg:w-[2rem] lg:h-[2rem]" />
          </button>
          <button
            onClick={handleSave}
            className={`mt-[0.5rem] ${question.isSaved ? 'text-[#2563EB]' : 'text-[#9CA3AF]'} hover:text-[#2563EB]`}
          >
            <Bookmark className="w-[1.25rem] h-[1.25rem]" fill={question.isSaved ? '#2563EB' : 'none'} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h1 className="text-[clamp(1.125rem,2.5vw,1.5rem)] font-bold font-display text-[#1A1A1A] mb-[0.75rem] lg:mb-[1rem]">
            {question.title}
          </h1>
          <div className="prose font-mono text-[0.75rem] lg:text-[0.875rem] text-[#666666] mb-[0.75rem] lg:mb-[1rem] whitespace-pre-wrap overflow-x-auto">
            {question.body}
          </div>
          <div className="flex flex-wrap gap-[0.375rem] lg:gap-[0.5rem] mb-[0.75rem] lg:mb-[1rem]">
            {question.tags.map((tag) => (
              <span
                key={tag.name}
                className={`px-[0.5rem] py-[0.125rem] lg:py-[0.25rem] rounded text-[0.625rem] lg:text-[0.75rem] font-mono ${tag.color}`}
              >
                {tag.name}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-[0.5rem] text-[0.75rem] lg:text-[0.875rem]">
            <div className="w-[1.25rem] h-[1.25rem] lg:w-[1.5rem] lg:h-[1.5rem] bg-[#2563EB] rounded-full flex items-center justify-center">
              <span className="text-white text-[0.625rem] lg:text-[0.75rem] font-bold">
                {question.author.name.charAt(0)}
              </span>
            </div>
            <span className="text-[#666666] font-mono">{question.author.name}</span>
            <span className="text-[#9CA3AF] font-mono">・{question.createdAt}</span>
          </div>
        </div>
      </div>

      {/* Answers */}
      <div className="border-t border-[#E5E7EB] pt-[1rem] lg:pt-[1.5rem]">
        <h2 className="text-[1rem] lg:text-[1.125rem] font-semibold font-mono text-[#1A1A1A] mb-[1rem] lg:mb-[1.5rem] flex items-center gap-[0.5rem]">
          <MessageSquare className="w-[1.125rem] h-[1.125rem]" />
          {answers.length}件の回答
        </h2>

        {answers.map((answer) => (
          <div key={answer.id} className="bg-white rounded-xl p-[1rem] lg:p-[1.5rem] mb-[0.75rem] lg:mb-[1rem] flex gap-[0.75rem] lg:gap-[1rem]">
            {/* Vote */}
            <div className="flex flex-col items-center gap-[0.25rem] lg:gap-[0.5rem]">
              <button
                onClick={() => handleVote(1, 'answer', answer.id)}
                className={`${answer.userVote === 1 ? 'text-[#2563EB]' : 'text-[#9CA3AF]'} hover:text-[#2563EB]`}
              >
                <ChevronUp className="w-[1.25rem] h-[1.25rem] lg:w-[1.5rem] lg:h-[1.5rem]" />
              </button>
              <span className="text-[1rem] lg:text-[1.125rem] font-bold text-[#1A1A1A]">{answer.votes}</span>
              <button
                onClick={() => handleVote(-1, 'answer', answer.id)}
                className={`${answer.userVote === -1 ? 'text-[#DC2626]' : 'text-[#9CA3AF]'} hover:text-[#DC2626]`}
              >
                <ChevronDown className="w-[1.25rem] h-[1.25rem] lg:w-[1.5rem] lg:h-[1.5rem]" />
              </button>
              {answer.isAccepted && (
                <div className="w-[1.5rem] h-[1.5rem] lg:w-[2rem] lg:h-[2rem] bg-[#059669] rounded-full flex items-center justify-center mt-[0.25rem] lg:mt-[0.5rem]">
                  <Check className="w-[0.875rem] h-[0.875rem] lg:w-[1.25rem] lg:h-[1.25rem] text-white" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {answer.isAccepted && (
                <span className="inline-block px-[0.5rem] py-[0.25rem] bg-[#059669] text-white text-[0.625rem] lg:text-[0.75rem] font-mono rounded mb-[0.5rem] lg:mb-[0.75rem]">
                  ✓ ベストアンサー
                </span>
              )}
              <div className="prose font-mono text-[0.75rem] lg:text-[0.875rem] text-[#666666] mb-[0.75rem] lg:mb-[1rem] whitespace-pre-wrap overflow-x-auto">
                {answer.body}
              </div>
              <div className="flex items-center gap-[0.5rem] text-[0.75rem] lg:text-[0.875rem]">
                <div className="w-[1.25rem] h-[1.25rem] lg:w-[1.5rem] lg:h-[1.5rem] bg-[#059669] rounded-full flex items-center justify-center">
                  <span className="text-white text-[0.625rem] lg:text-[0.75rem] font-bold">
                    {answer.author.name.charAt(0)}
                  </span>
                </div>
                <span className="text-[#666666] font-mono">{answer.author.name}</span>
                <span className="text-[#9CA3AF] font-mono">・{answer.createdAt}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Answer Form */}
      <div className="mt-[1.5rem] lg:mt-[2rem] border-t border-[#E5E7EB] pt-[1rem] lg:pt-[1.5rem]">
        <h3 className="text-[1rem] lg:text-[1.125rem] font-semibold font-mono text-[#1A1A1A] mb-[0.75rem] lg:mb-[1rem]">回答を投稿</h3>
        {user ? (
          <>
            <textarea
              value={answerBody}
              onChange={(e) => setAnswerBody(e.target.value)}
              placeholder="回答を入力してください..."
              className="w-full h-[6rem] lg:h-[8rem] px-[0.75rem] lg:px-[1rem] py-[0.5rem] lg:py-[0.75rem] rounded-lg border border-[#E5E7EB] text-[0.75rem] lg:text-[0.875rem] font-mono outline-none focus:border-[#2563EB] transition-colors resize-none mb-[0.75rem] lg:mb-[1rem]"
            />
            <button
              onClick={handleSubmitAnswer}
              disabled={isSubmitting || !answerBody.trim()}
              className="w-full lg:w-auto px-[1rem] lg:px-[1.5rem] py-[0.625rem] lg:py-[0.75rem] bg-[#2563EB] text-white rounded-lg text-[0.75rem] lg:text-[0.875rem] font-mono font-semibold hover:bg-[#1D4ED8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '投稿中...' : '回答を投稿'}
            </button>
          </>
        ) : (
          <div className="bg-[#F3F4F6] rounded-lg p-[1rem] text-center">
            <p className="text-[0.875rem] text-[#6B7280] font-mono mb-[0.75rem]">回答するにはログインが必要です</p>
            <Link
              href="/login"
              className="inline-block px-[1.5rem] py-[0.75rem] bg-[#2563EB] text-white rounded-lg text-[0.875rem] font-mono font-semibold hover:bg-[#1D4ED8] transition-colors"
            >
              ログインする
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
