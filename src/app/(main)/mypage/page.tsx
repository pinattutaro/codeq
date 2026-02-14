'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, User, MessageSquare, Award, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl?: string;
  questionsCount: number;
  answersCount: number;
  totalVotes: number;
  bestAnswersCount: number;
}

interface Activity {
  type: string;
  icon: typeof Award | typeof Star | typeof MessageSquare;
  color: string;
  text: string;
  time: string;
}

export default function MyPage() {
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const response = await fetch('/api/users/me');
        if (response.ok) {
          const data = await response.json();
          setProfile({
            id: data.id,
            username: data.name,
            displayName: data.displayName || data.name,
            bio: data.bio || '',
            avatarUrl: data.avatarUrl,
            questionsCount: data._count?.questions || 0,
            answersCount: data._count?.answers || 0,
            totalVotes: data.totalVotes || 0,
            bestAnswersCount: data.bestAnswersCount || 0,
          });
          // アクティビティのサンプルデータ
          setActivities([
            {
              type: 'answer',
              icon: Award,
              color: 'text-[#059669]',
              text: '質問に回答しました',
              time: '最近',
            },
          ]);
        }
      } catch {
        console.error('プロフィールの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const handleLogout = async () => {
    await signOut();
    router.push('/');
    router.refresh();
  };

  if (!authLoading && !user) {
    return (
      <div className="p-[1rem] lg:p-[2rem] max-w-4xl">
        <div className="bg-white rounded-xl p-[2rem] text-center">
          <h2 className="text-[1.25rem] font-bold font-display text-[#1A1A1A] mb-[1rem]">
            ログインが必要です
          </h2>
          <p className="text-[0.875rem] text-[#6B7280] font-mono mb-[1.5rem]">
            マイページを表示するにはログインしてください
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

  const stats = [
    { label: '質問', value: profile?.questionsCount || 0, icon: MessageSquare },
    { label: '回答', value: profile?.answersCount || 0, icon: MessageSquare },
    { label: '獲得ポイント', value: profile?.totalVotes || 0, icon: Star },
    { label: 'ベストアンサー', value: profile?.bestAnswersCount || 0, icon: Award },
  ];

  return (
    <div className="p-[1rem] lg:p-[2rem] max-w-4xl">
      {/* Profile Card */}
      <div className="bg-white rounded-xl p-[1rem] lg:p-[1.5rem] flex flex-col lg:flex-row items-center lg:justify-between gap-[1rem] mb-[1rem] lg:mb-[1.5rem]">
        <div className="flex flex-col lg:flex-row items-center gap-[1rem] lg:gap-[1.5rem] text-center lg:text-left">
          <div className="w-[5rem] h-[5rem] lg:w-[6.25rem] lg:h-[6.25rem] bg-[#2563EB] rounded-full flex items-center justify-center overflow-hidden">
            {profile?.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.displayName} className="w-full h-full object-cover" />
            ) : (
              <>
                <User className="w-[2.25rem] h-[2.25rem] text-white lg:hidden" />
                <User className="w-[3rem] h-[3rem] text-white hidden lg:block" />
              </>
            )}
          </div>
          <div className="flex flex-col gap-[0.25rem] lg:gap-[0.5rem]">
            <h1 className="text-[clamp(1.125rem,2vw,1.5rem)] font-bold font-display text-[#1A1A1A]">
              {profile?.displayName || profile?.username}
            </h1>
            <p className="text-[0.75rem] lg:text-[0.875rem] text-[#666666] font-mono">
              @{profile?.username}
              {profile?.bio && (
                <>
                  <br className="lg:hidden" />
                  <span className="hidden lg:inline"> · </span>
                  {profile.bio}
                </>
              )}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full lg:w-auto flex items-center justify-center gap-[0.5rem] px-[1rem] py-[0.625rem] bg-[#FEE2E2] rounded-lg text-[#DC2626] font-mono text-[0.875rem] font-medium hover:bg-[#FECACA] transition-colors"
        >
          <LogOut className="w-[1.125rem] h-[1.125rem]" />
          ログアウト
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 lg:grid-cols-4 gap-[0.75rem] lg:gap-[1rem] mb-[1rem] lg:mb-[1.5rem]">
        {stats.slice(0, 3).map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl p-[0.75rem] lg:p-[1.25rem] flex flex-col items-center gap-[0.125rem] lg:gap-[0.25rem]"
          >
            <span className="text-[clamp(1.25rem,3vw,1.875rem)] font-bold text-[#2563EB]">{stat.value}</span>
            <span className="text-[0.625rem] lg:text-[0.875rem] text-[#6B7280] font-mono">{stat.label}</span>
          </div>
        ))}
        <div className="hidden lg:flex bg-white rounded-xl p-[1.25rem] flex-col items-center gap-[0.25rem]">
          <span className="text-[1.875rem] font-bold text-[#2563EB]">{stats[3].value}</span>
          <span className="text-[0.875rem] text-[#6B7280] font-mono">{stats[3].label}</span>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-[1rem] lg:p-[1.5rem]">
        <h2 className="text-[1rem] lg:text-[1.125rem] font-semibold font-mono text-[#1A1A1A] mb-[0.75rem] lg:mb-[1rem]">最近のアクティビティ</h2>
        {activities.length === 0 ? (
          <p className="text-[#6B7280] font-mono text-[0.875rem]">まだアクティビティがありません</p>
        ) : (
          <div className="flex flex-col gap-[0.75rem] lg:gap-[1rem]">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-start lg:items-center gap-[0.75rem] py-[0.5rem] lg:py-[0.75rem] border-b border-[#E5E7EB] last:border-0">
                <activity.icon className={`w-[1.125rem] h-[1.125rem] ${activity.color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-[0.75rem] lg:text-[0.875rem] text-[#1A1A1A] font-mono truncate">{activity.text}</p>
                  <span className="text-[0.625rem] lg:text-[0.75rem] text-[#9CA3AF] font-mono">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
