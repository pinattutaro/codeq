'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, FormEvent } from 'react';
import { BrandLeftPanel } from '@/components/BrandLeftPanel';
import { Mail, Lock, Eye, EyeOff, Github, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message === 'Invalid login credentials' 
          ? 'メールアドレスまたはパスワードが正しくありません' 
          : error.message);
        return;
      }

      router.push('/');
      router.refresh();
    } catch {
      setError('ログイン中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
  };

  return (
    <>
      {/* Desktop Version */}
      <div className="hidden lg:flex min-h-screen">
        {/* Left Panel */}
        <BrandLeftPanel />

        {/* Right Panel - Login Form */}
        <div className="w-1/2 min-h-screen bg-white flex items-center justify-center p-[5vw]">
          <form onSubmit={handleSubmit} className="w-full max-w-[25rem] flex flex-col gap-[1.5rem]">
            <div className="flex flex-col gap-[1rem]">
              <h1 className="text-[clamp(1.75rem,2.5vw,2rem)] font-bold font-display text-[#1A1A1A]">
                ログイン
              </h1>
              <p className="text-[#6B7280] font-mono text-[clamp(0.75rem,1vw,0.875rem)] leading-[1.4]">
                アカウントにログインして、質問を投稿しましょう
              </p>
            </div>

            {error && (
              <div className="p-[0.75rem] bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-[0.875rem] font-mono">{error}</p>
              </div>
            )}

            {/* Email Field */}
            <div className="flex flex-col gap-[0.5rem] w-full">
              <label className="text-[0.875rem] font-mono font-semibold text-[#1A1A1A]">
                メールアドレス
              </label>
              <div className="h-[3rem] px-[1rem] rounded-lg bg-white border border-[#E5E7EB] flex items-center">
                <input
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full text-[0.875rem] font-mono outline-none placeholder:text-[#9CA3AF]"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-[0.5rem] w-full">
              <label className="text-[0.875rem] font-mono font-semibold text-[#1A1A1A]">
                パスワード
              </label>
              <div className="h-[3rem] px-[1rem] rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-between">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="flex-1 text-[0.875rem] font-mono outline-none placeholder:text-[#9CA3AF]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#9CA3AF] hover:text-[#6B7280]"
                >
                  {showPassword ? (
                    <Eye className="w-[1.25rem] h-[1.25rem]" />
                  ) : (
                    <EyeOff className="w-[1.25rem] h-[1.25rem]" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <Link
              href="/forgot-password"
              className="text-[0.75rem] font-mono text-[#2563EB] hover:underline"
            >
              パスワードを忘れた場合
            </Link>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[3rem] bg-[#2563EB] text-white rounded-lg text-[1rem] font-mono font-semibold hover:bg-[#1D4ED8] transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-[1.25rem] h-[1.25rem] animate-spin" />
              ) : (
                'ログイン'
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-[1rem] w-full">
              <div className="flex-1 h-px bg-[#E5E7EB]"></div>
              <span className="text-[0.75rem] text-[#6B7280] font-mono">または</span>
              <div className="flex-1 h-px bg-[#E5E7EB]"></div>
            </div>

            {/* GitHub Button */}
            <button 
              type="button"
              onClick={handleGithubLogin}
              className="w-full h-[3rem] bg-white border border-[#E5E7EB] rounded-lg text-[0.875rem] font-mono font-medium text-[#1A1A1A] hover:bg-[#F7F7F7] transition-colors flex items-center justify-center gap-[0.75rem]"
            >
              <Github className="w-[1.25rem] h-[1.25rem]" />
              GitHubでログイン
            </button>

            {/* Sign Up Link */}
            <div className="flex items-center justify-center gap-[0.5rem] w-full">
              <span className="text-[0.875rem] font-mono text-[#6B7280]">
                アカウントをお持ちでない場合
              </span>
              <Link href="/register" className="text-[0.875rem] font-mono text-[#2563EB] font-semibold hover:underline">
                新規登録
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Mobile Version */}
      <div className="lg:hidden min-h-screen bg-[#2563EB] flex flex-col items-center justify-center gap-[1.5rem] p-[1.5rem]">
        {/* Logo Section */}
        <div className="flex flex-col items-center gap-[0.75rem]">
          <div className="w-[3.5rem] h-[3.5rem] bg-white rounded-[0.875rem] flex items-center justify-center">
            <span className="text-[#2563EB] font-mono text-[1.75rem] font-bold">C</span>
          </div>
          <h1 className="text-white font-display text-[2rem] font-bold">CodeQ</h1>
          <p className="text-white/80 font-display text-[0.8125rem] text-center leading-[1.5]">
            プログラマーのための<br />質問・回答プラットフォーム
          </p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="w-full bg-white rounded-2xl p-[1.5rem] flex flex-col gap-[1.25rem]">
          <h2 className="text-[1.5rem] font-bold font-display text-[#1A1A1A]">
            ログイン
          </h2>
          <p className="text-[#6B7280] font-mono text-[0.75rem] leading-[1.4]">
            アカウントにログインして、<br />質問を投稿しましょう
          </p>

          {error && (
            <div className="p-[0.5rem] bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-[0.75rem] font-mono">{error}</p>
            </div>
          )}

          {/* Email Field */}
          <div className="flex flex-col gap-[0.375rem] w-full">
            <label className="text-[0.75rem] font-mono font-semibold text-[#1A1A1A]">
              メールアドレス
            </label>
            <div className="h-[2.75rem] px-[0.75rem] rounded-lg bg-white border border-[#E5E7EB] flex items-center gap-[0.5rem]">
              <Mail className="w-[1.125rem] h-[1.125rem] text-[#9CA3AF] flex-shrink-0" />
              <input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 text-[0.8125rem] font-mono outline-none placeholder:text-[#9CA3AF]"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-[0.375rem] w-full">
            <label className="text-[0.75rem] font-mono font-semibold text-[#1A1A1A]">
              パスワード
            </label>
            <div className="h-[2.75rem] px-[0.75rem] rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-between">
              <div className="flex items-center gap-[0.5rem]">
                <Lock className="w-[1.125rem] h-[1.125rem] text-[#9CA3AF] flex-shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="text-[0.8125rem] font-mono outline-none placeholder:text-[#9CA3AF]"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[#9CA3AF] hover:text-[#6B7280] flex-shrink-0"
              >
                {showPassword ? (
                  <Eye className="w-[1.125rem] h-[1.125rem]" />
                ) : (
                  <EyeOff className="w-[1.125rem] h-[1.125rem]" />
                )}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <Link
            href="/forgot-password"
            className="text-[0.6875rem] font-mono text-[#2563EB] hover:underline"
          >
            パスワードを忘れた場合
          </Link>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-[2.75rem] bg-[#2563EB] text-white rounded-lg text-[0.875rem] font-mono font-semibold hover:bg-[#1D4ED8] transition-colors flex items-center justify-center disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-[1rem] h-[1rem] animate-spin" />
            ) : (
              'ログイン'
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-[0.75rem] w-full">
            <div className="flex-1 h-px bg-[#E5E7EB]"></div>
            <span className="text-[0.6875rem] text-[#6B7280] font-mono">または</span>
            <div className="flex-1 h-px bg-[#E5E7EB]"></div>
          </div>

          {/* GitHub Button */}
          <button 
            type="button"
            onClick={handleGithubLogin}
            className="w-full h-[2.75rem] bg-white rounded-lg text-[0.8125rem] font-mono font-medium text-[#1A1A1A] hover:bg-[#F7F7F7] transition-colors flex items-center justify-center gap-[0.625rem] border border-[#E5E7EB]"
          >
            <Github className="w-[1.125rem] h-[1.125rem]" />
            GitHubでログイン
          </button>

          {/* Sign Up Link */}
          <div className="flex items-center justify-center gap-[0.375rem] w-full">
            <span className="text-[0.6875rem] font-mono text-[#6B7280]">
              アカウントをお持ちでない場合
            </span>
            <Link href="/register" className="text-[0.6875rem] font-mono text-[#2563EB] font-semibold hover:underline">
              新規登録
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
