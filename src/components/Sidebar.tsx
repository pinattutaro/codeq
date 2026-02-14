'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Bookmark, User, SquarePen } from 'lucide-react';

const navItems = [
  { href: '/', icon: Home, label: 'ホーム' },
  { href: '/explore', icon: Compass, label: '探索' },
  { href: '/post', icon: SquarePen, label: '投稿' },
  { href: '/saved', icon: Bookmark, label: '保存' },
  { href: '/mypage', icon: User, label: 'マイページ' },
];

const popularTags = [
  { name: 'JavaScript', color: 'bg-[#2563EB]/20 text-[#2563EB]' },
  { name: 'Python', color: 'bg-[#059669]/20 text-[#059669]' },
  { name: 'React', color: 'bg-[#F59E0B]/20 text-[#F59E0B]' },
  { name: 'TypeScript', color: 'bg-[#DC2626]/20 text-[#DC2626]' },
  { name: 'Node.js', color: 'bg-[#6B7280]/20 text-[#6B7280]' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-[17.5rem] h-screen bg-[#1A1A1A] p-[1.5rem] flex-col gap-[2rem] fixed left-0 top-0">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-[0.75rem]">
          <div className="w-[2.5rem] h-[2.5rem] bg-[#2563EB] rounded-[0.625rem] flex items-center justify-center">
            <span className="text-white font-bold text-[1.25rem] font-mono">C</span>
          </div>
          <span className="text-white font-display text-[1.5rem] font-bold">CodeQ</span>
        </Link>

        {/* Navigation */}
        <nav className="flex flex-col gap-[0.5rem]">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-[0.75rem] px-[1rem] h-[2.75rem] rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[#2563EB]/20 text-[#2563EB] font-semibold'
                    : 'text-[#9CA3AF] hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className="w-[1.25rem] h-[1.25rem]" />
                <span className="text-[0.875rem] font-mono">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Popular Tags */}
        <div className="flex flex-col gap-[1rem]">
          <span className="text-[#6B7280] text-[0.75rem] font-semibold font-mono">人気のタグ</span>
          <div className="flex flex-wrap gap-[0.5rem]">
            {popularTags.map((tag) => (
              <Link
                key={tag.name}
                href={`/explore?tag=${tag.name}`}
                className={`px-[0.75rem] py-[0.375rem] rounded-md text-[0.75rem] font-mono ${tag.color}`}
              >
                {tag.name}
              </Link>
            ))}
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-[3.5rem] bg-[#1A1A1A] flex items-center justify-between px-[1rem] z-50">
        <Link href="/" className="flex items-center gap-[0.5rem]">
          <div className="w-[2rem] h-[2rem] bg-[#2563EB] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-[1rem] font-mono">C</span>
          </div>
          <span className="text-white font-display text-[1.125rem] font-bold">CodeQ</span>
        </Link>
      </header>

      {/* Mobile Tab Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-[4rem] bg-white border-t border-[#E5E7EB] flex items-center justify-around z-50">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-[0.25rem] px-[0.75rem] py-[0.5rem] ${
                isActive ? 'text-[#2563EB]' : 'text-[#9CA3AF]'
              }`}
            >
              <item.icon className="w-[1.25rem] h-[1.25rem]" />
              <span className={`text-[0.625rem] font-mono ${isActive ? 'font-semibold' : ''}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

export default Sidebar;
