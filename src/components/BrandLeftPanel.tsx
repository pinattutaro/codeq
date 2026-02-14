import { Code, Users, Zap } from 'lucide-react';

export function BrandLeftPanel() {
  return (
    <div className="w-1/2 min-h-screen bg-[#2563EB] flex flex-col items-center justify-center p-[3.75rem] gap-[1.5rem]">
      {/* Brand Icon */}
      <div className="w-[4rem] h-[4rem] bg-white rounded-[1rem] flex items-center justify-center">
        <span className="text-[#2563EB] font-mono text-[2rem] font-bold">C</span>
      </div>

      {/* Brand Name */}
      <span className="text-white font-display text-[3rem] font-bold">CodeQ</span>

      {/* Tagline */}
      <p className="text-white/80 font-display text-[1.25rem] text-center leading-[1.6] max-w-[25rem]">
        プログラマーのための
        <br />
        質問・回答プラットフォーム
      </p>

      {/* Feature List */}
      <div className="flex flex-col gap-[1rem] mt-[2rem]">
        <div className="flex items-center gap-[0.75rem]">
          <Code className="w-[1.5rem] h-[1.5rem] text-white" />
          <span className="text-white font-mono text-[1rem]">コードに特化した質問</span>
        </div>
        <div className="flex items-center gap-[0.75rem]">
          <Users className="w-[1.5rem] h-[1.5rem] text-white" />
          <span className="text-white font-mono text-[1rem]">経験豊富なコミュニティ</span>
        </div>
        <div className="flex items-center gap-[0.75rem]">
          <Zap className="w-[1.5rem] h-[1.5rem] text-white" />
          <span className="text-white font-mono text-[1rem]">迅速な回答</span>
        </div>
      </div>
    </div>
  );
}
