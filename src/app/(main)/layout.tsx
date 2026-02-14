import { Sidebar } from '@/components';
import { ReactNode } from 'react';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <Sidebar />
      <main className="lg:ml-[17.5rem] pt-[3.5rem] pb-[4rem] lg:pt-0 lg:pb-0">
        {children}
      </main>
    </div>
  );
}
