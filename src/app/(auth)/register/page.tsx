'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, FormEvent } from 'react';
import { BrandLeftPanel } from '@/components/BrandLeftPanel';
import { User, Mail, Lock, Eye, EyeOff, Github, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (password !== confirmPassword) {
      setError('パスワードが一致しません');
      return;
    }

    if (password.length < 6) {
      setError('パスワードは6文字以上で入力してください');
      return;
    }

    if (!agreedToTerms) {
      setError('利用規約とプライバシーポリシーに同意してください');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
          data: {
            username,
            display_name: username,
          },
        },
      });

      if (error) {
        if (error.message.includes('already registered')) {
          setError('このメールアドレスは既に登録されています');
        } else {
          setError(error.message);
        }
        return;
      }

      if (data.user) {
        // Create user profile in database
        await fetch('/api/users/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            supabaseId: data.user.id,
            email,
            name: username,
            displayName: username,
          }),
        });

        // Supabaseの設定によっては確認メールが必要な場合がある
        if (data.session) {
          router.push('/');
          router.refresh();
        } else {
          // メール確認が必要な場合
          router.push('/login?message=確認メールを送信しました。メールを確認してください。');
        }
      }
    } catch {
      setError('登録中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const handleGithubSignup = async () => {
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

        {/* Right Panel - Register Form */}
        <div className="w-1/2 min-h-screen bg-white flex items-center justify-center p-[5vw]">
          <form onSubmit={handleSubmit} className="w-full max-w-[25rem] flex flex-col gap-[1.25rem]">
            <div className="flex flex-col gap-[0.75rem]">
              <h1 className="text-[clamp(1.75rem,2.5vw,2rem)] font-bold font-display text-[#1A1A1A]">
                新規登録
              </h1>
              <p className="text-[#6B7280] font-mono text-[clamp(0.75rem,1vw,0.875rem)] leading-[1.4]">
                アカウントを作成して、コミュニティに参加しましょう
              </p>
            </div>

            {error && (
              <div className="p-[0.75rem] bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-[0.875rem] font-mono">{error}</p>
              </div>
            )}

            {/* Username Field */}
            <div className="flex flex-col gap-[0.5rem] w-full">
              <label className="text-[0.875rem] font-mono font-semibold text-[#1A1A1A]">
                ユーザー名
              </label>
              <div className="h-[3rem] px-[1rem] rounded-lg bg-white border border-[#E5E7EB] flex items-center">
                <input
                  type="text"
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full text-[0.875rem] font-mono outline-none placeholder:text-[#9CA3AF]"
                />
              </div>
            </div>

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

            {/* Confirm Password Field */}
            <div className="flex flex-col gap-[0.5rem] w-full">
              <label className="text-[0.875rem] font-mono font-semibold text-[#1A1A1A]">
                パスワード（確認）
              </label>
              <div className="h-[3rem] px-[1rem] rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-between">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="flex-1 text-[0.875rem] font-mono outline-none placeholder:text-[#9CA3AF]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-[#9CA3AF] hover:text-[#6B7280]"
                >
                  {showConfirmPassword ? (
                    <Eye className="w-[1.25rem] h-[1.25rem]" />
                  ) : (
                    <EyeOff className="w-[1.25rem] h-[1.25rem]" />
                  )}
                </button>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-center gap-[0.5rem] w-full">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-[1rem] h-[1rem] accent-[#2563EB] cursor-pointer"
              />
              <label htmlFor="terms" className="text-[0.75rem] font-mono text-[#6B7280] cursor-pointer">
                利用規約とプライバシーポリシーに同意します
              </label>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[3rem] bg-[#2563EB] text-white rounded-lg text-[1rem] font-mono font-semibold hover:bg-[#1D4ED8] transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-[1.25rem] h-[1.25rem] animate-spin" />
              ) : (
                'アカウントを作成'
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
              onClick={handleGithubSignup}
              className="w-full h-[3rem] bg-white border border-[#E5E7EB] rounded-lg text-[0.875rem] font-mono font-medium text-[#1A1A1A] hover:bg-[#F7F7F7] transition-colors flex items-center justify-center gap-[0.75rem]"
            >
              <Github className="w-[1.25rem] h-[1.25rem]" />
              GitHubで登録
            </button>

            {/* Login Link */}
            <div className="flex items-center justify-center gap-[0.5rem] w-full">
              <span className="text-[0.875rem] font-mono text-[#6B7280]">
                すでにアカウントをお持ちの場合
              </span>
              <Link href="/login" className="text-[0.875rem] font-mono text-[#2563EB] font-semibold hover:underline">
                ログイン
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Mobile Version */}
      <div className="lg:hidden min-h-screen bg-[#2563EB] flex flex-col items-center justify-center gap-[1.25rem] p-[1.5rem]">
        {/* Logo Section */}
        <div className="flex flex-col items-center gap-[0.5rem]">
          <div className="w-[3rem] h-[3rem] bg-white rounded-xl flex items-center justify-center">
            <span className="text-[#2563EB] font-mono text-[1.5rem] font-bold">C</span>
          </div>
          <h1 className="text-white font-display text-[1.75rem] font-bold">CodeQ</h1>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="w-full bg-white rounded-2xl p-[1.25rem] flex flex-col gap-[0.875rem]">
          <h2 className="text-[1.375rem] font-bold font-display text-[#1A1A1A]">
            新規登録
          </h2>
          <p className="text-[#6B7280] font-mono text-[0.6875rem] leading-[1.4]">
            アカウントを作成して、コミュニティに参加しましょう
          </p>

          {error && (
            <div className="p-[0.5rem] bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-[0.6875rem] font-mono">{error}</p>
            </div>
          )}

          {/* Username Field */}
          <div className="flex flex-col gap-[0.25rem] w-full">
            <label className="text-[0.6875rem] font-mono font-semibold text-[#1A1A1A]">
              ユーザー名
            </label>
            <div className="h-[2.5rem] px-[0.75rem] rounded-lg bg-white border border-[#E5E7EB] flex items-center gap-[0.5rem]">
              <User className="w-[1rem] h-[1rem] text-[#9CA3AF] flex-shrink-0" />
              <input
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="flex-1 text-[0.75rem] font-mono outline-none placeholder:text-[#9CA3AF]"
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="flex flex-col gap-[0.25rem] w-full">
            <label className="text-[0.6875rem] font-mono font-semibold text-[#1A1A1A]">
              メールアドレス
            </label>
            <div className="h-[2.5rem] px-[0.75rem] rounded-lg bg-white border border-[#E5E7EB] flex items-center gap-[0.5rem]">
              <Mail className="w-[1rem] h-[1rem] text-[#9CA3AF] flex-shrink-0" />
              <input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 text-[0.75rem] font-mono outline-none placeholder:text-[#9CA3AF]"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-[0.25rem] w-full">
            <label className="text-[0.6875rem] font-mono font-semibold text-[#1A1A1A]">
              パスワード
            </label>
            <div className="h-[2.5rem] px-[0.75rem] rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-between">
              <div className="flex items-center gap-[0.5rem]">
                <Lock className="w-[1rem] h-[1rem] text-[#9CA3AF] flex-shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="text-[0.75rem] font-mono outline-none placeholder:text-[#9CA3AF]"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[#9CA3AF] hover:text-[#6B7280] flex-shrink-0"
              >
                {showPassword ? (
                  <Eye className="w-[1rem] h-[1rem]" />
                ) : (
                  <EyeOff className="w-[1rem] h-[1rem]" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="flex flex-col gap-[0.25rem] w-full">
            <label className="text-[0.6875rem] font-mono font-semibold text-[#1A1A1A]">
              パスワード（確認）
            </label>
            <div className="h-[2.5rem] px-[0.75rem] rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-between">
              <div className="flex items-center gap-[0.5rem]">
                <Lock className="w-[1rem] h-[1rem] text-[#9CA3AF] flex-shrink-0" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="text-[0.75rem] font-mono outline-none placeholder:text-[#9CA3AF]"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-[#9CA3AF] hover:text-[#6B7280] flex-shrink-0"
              >
                {showConfirmPassword ? (
                  <Eye className="w-[1rem] h-[1rem]" />
                ) : (
                  <EyeOff className="w-[1rem] h-[1rem]" />
                )}
              </button>
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-center gap-[0.5rem] w-full">
            <input
              type="checkbox"
              id="terms-mobile"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="w-[0.875rem] h-[0.875rem] accent-[#2563EB] cursor-pointer"
            />
            <label htmlFor="terms-mobile" className="text-[0.625rem] font-mono text-[#6B7280] cursor-pointer">
              利用規約とプライバシーポリシーに同意
            </label>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-[2.5rem] bg-[#2563EB] text-white rounded-lg text-[0.8125rem] font-mono font-semibold hover:bg-[#1D4ED8] transition-colors flex items-center justify-center disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-[1rem] h-[1rem] animate-spin" />
            ) : (
              'アカウントを作成'
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-[0.75rem] w-full">
            <div className="flex-1 h-px bg-[#E5E7EB]"></div>
            <span className="text-[0.625rem] text-[#6B7280] font-mono">または</span>
            <div className="flex-1 h-px bg-[#E5E7EB]"></div>
          </div>

          {/* GitHub Button */}
          <button 
            type="button"
            onClick={handleGithubSignup}
            className="w-full h-[2.5rem] bg-white rounded-lg text-[0.75rem] font-mono font-medium text-[#1A1A1A] hover:bg-[#F7F7F7] transition-colors flex items-center justify-center gap-[0.5rem] border border-[#E5E7EB]"
          >
            <Github className="w-[1rem] h-[1rem]" />
            GitHubで登録
          </button>

          {/* Login Link */}
          <div className="flex items-center justify-center gap-[0.375rem] w-full">
            <span className="text-[0.625rem] font-mono text-[#6B7280]">
              すでにアカウントをお持ちの場合
            </span>
            <Link href="/login" className="text-[0.625rem] font-mono text-[#2563EB] font-semibold hover:underline">
              ログイン
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
