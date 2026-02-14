'use client';

import { LogOut, User, MessageSquare, Award, Star } from 'lucide-react';
import Link from 'next/link';

const stats = [
  { label: '質問', value: 45, icon: MessageSquare },
  { label: '回答', value: 128, icon: MessageSquare },
  { label: '獲得ポイント', value: 892, icon: Star },
  { label: 'ベストアンサー', value: 56, icon: Award },
];

const activities = [
  {
    type: 'answer',
    icon: Award,
    color: 'text-[#059669]',
    text: '「REST APIのベストプラクティス」に回答しました',
    time: '2時間前',
  },
  {
    type: 'badge',
    icon: Star,
    color: 'text-[#F59E0B]',
    text: '「TypeScriptマスター」を獲得しました',
    time: '1日前',
  },
  {
    type: 'accept',
    icon: Award,
    color: 'text-[#2563EB]',
    text: 'あなたの回答がベストアンサーに選ばれました',
    time: '3日前',
  },
];

export default function MyPage() {
  return (
    <div className="p-[1rem] lg:p-[2rem] max-w-4xl">
      {/* Profile Card */}
      <div className="bg-white rounded-xl p-[1rem] lg:p-[1.5rem] flex flex-col lg:flex-row items-center lg:justify-between gap-[1rem] mb-[1rem] lg:mb-[1.5rem]">
        <div className="flex flex-col lg:flex-row items-center gap-[1rem] lg:gap-[1.5rem] text-center lg:text-left">
          <div className="w-[5rem] h-[5rem] lg:w-[6.25rem] lg:h-[6.25rem] bg-[#2563EB] rounded-full flex items-center justify-center">
            <User className="w-[2.25rem] h-[2.25rem] text-white lg:hidden" />
            <User className="w-[3rem] h-[3rem] text-white hidden lg:block" />
          </div>
          <div className="flex flex-col gap-[0.25rem] lg:gap-[0.5rem]">
            <h1 className="text-[clamp(1.125rem,2vw,1.5rem)] font-bold font-display text-[#1A1A1A]">tanaka_dev</h1>
            <p className="text-[0.75rem] lg:text-[0.875rem] text-[#666666] font-mono">
              フロントエンドエンジニア<br className="lg:hidden" />
              <span className="hidden lg:inline"> · </span>React / TypeScript
            </p>
          </div>
        </div>
        <Link
          href="/login"
          className="w-full lg:w-auto flex items-center justify-center gap-[0.5rem] px-[1rem] py-[0.625rem] bg-[#FEE2E2] rounded-lg text-[#DC2626] font-mono text-[0.875rem] font-medium hover:bg-[#FECACA] transition-colors"
        >
          <LogOut className="w-[1.125rem] h-[1.125rem]" />
          ログアウト
        </Link>
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
      </div>
    </div>
  );
}
