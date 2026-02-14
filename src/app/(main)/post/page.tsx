'use client';

import { useState } from 'react';
import { X, Lightbulb, Code, MessageSquare, FileText } from 'lucide-react';

const suggestedTags = [
  { name: 'JavaScript', color: 'bg-[#2563EB]/20 text-[#2563EB]' },
  { name: 'React', color: 'bg-[#F59E0B]/20 text-[#F59E0B]' },
  { name: 'TypeScript', color: 'bg-[#DC2626]/20 text-[#DC2626]' },
];

const tips = [
  { icon: Lightbulb, text: '具体的な状況を説明してください' },
  { icon: Code, text: '関連するコードを添付してください' },
  { icon: MessageSquare, text: 'エラーメッセージがあれば記載してください' },
];

export default function PostQuestionPage() {
  const [tags, setTags] = useState<string[]>([]);

  const addTag = (tagName: string) => {
    if (!tags.includes(tagName)) {
      setTags([...tags, tagName]);
    }
  };

  const removeTag = (tagName: string) => {
    setTags(tags.filter((t) => t !== tagName));
  };

  return (
    <div className="p-[1rem] lg:p-[2rem] max-w-4xl">
      {/* Header */}
      <div className="mb-[1rem] lg:mb-[1.5rem]">
        <h1 className="text-[clamp(1.125rem,3vw,1.875rem)] font-bold font-display text-[#1A1A1A]">質問を投稿</h1>
        <p className="text-[0.75rem] lg:text-[0.875rem] text-[#6B7280] font-mono mt-[0.25rem] lg:mt-[0.5rem] hidden lg:block">
          コードの疑問や問題を明確に共有して、コミュニティから回答を得ましょう
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl p-[1rem] lg:p-[1.5rem] mb-[1rem] lg:mb-[1.5rem]">
        {/* Title */}
        <div className="mb-[1rem] lg:mb-[1.5rem]">
          <label className="block text-[0.75rem] lg:text-[0.875rem] font-semibold text-[#1A1A1A] font-mono mb-[0.375rem] lg:mb-[0.5rem]">
            タイトル
          </label>
          <input
            type="text"
            placeholder="質問のタイトルを入力"
            className="w-full h-[2.5rem] lg:h-[3rem] px-[0.75rem] lg:px-[1rem] rounded-lg border border-[#E5E7EB] text-[0.75rem] lg:text-[0.875rem] font-mono outline-none focus:border-[#2563EB] transition-colors"
          />
        </div>

        {/* Content */}
        <div className="mb-[1rem] lg:mb-[1.5rem]">
          <label className="block text-[0.75rem] lg:text-[0.875rem] font-semibold text-[#1A1A1A] font-mono mb-[0.375rem] lg:mb-[0.5rem]">
            本文
          </label>
          <textarea
            placeholder="質問の詳細を入力してください..."
            className="w-full h-[8rem] lg:h-[12rem] px-[0.75rem] lg:px-[1rem] py-[0.5rem] lg:py-[0.75rem] rounded-lg border border-[#E5E7EB] text-[0.75rem] lg:text-[0.875rem] font-mono outline-none focus:border-[#2563EB] transition-colors resize-none"
          />
        </div>

        {/* Tags */}
        <div className="mb-[1rem] lg:mb-[1.5rem]">
          <label className="block text-[0.75rem] lg:text-[0.875rem] font-semibold text-[#1A1A1A] font-mono mb-[0.375rem] lg:mb-[0.5rem]">
            タグ
          </label>
          <div className="flex flex-wrap gap-[0.5rem] mb-[0.5rem] lg:mb-[0.75rem]">
            {tags.map((tag) => {
              const tagData = suggestedTags.find((t) => t.name === tag);
              return (
                <span
                  key={tag}
                  className={`flex items-center gap-[0.25rem] px-[0.5rem] lg:px-[0.75rem] py-[0.25rem] lg:py-[0.375rem] rounded text-[0.625rem] lg:text-[0.75rem] font-mono ${tagData?.color || 'bg-[#6B7280]/20 text-[#6B7280]'}`}
                >
                  {tag}
                  <button onClick={() => removeTag(tag)}>
                    <X className="w-[0.75rem] h-[0.75rem]" />
                  </button>
                </span>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-[0.5rem]">
            {suggestedTags
              .filter((t) => !tags.includes(t.name))
              .map((tag) => (
                <button
                  key={tag.name}
                  onClick={() => addTag(tag.name)}
                  className={`px-[0.5rem] lg:px-[0.75rem] py-[0.25rem] lg:py-[0.375rem] rounded text-[0.625rem] lg:text-[0.75rem] font-mono ${tag.color} opacity-60 hover:opacity-100 transition-opacity`}
                >
                  + {tag.name}
                </button>
              ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex flex-col-reverse lg:flex-row justify-end gap-[0.5rem] lg:gap-[0.75rem]">
          <button className="px-[1rem] lg:px-[1.5rem] py-[0.625rem] lg:py-[0.75rem] text-[0.75rem] lg:text-[0.875rem] font-mono text-[#6B7280] hover:text-[#1A1A1A] transition-colors border border-[#E5E7EB] rounded-lg lg:border-0">
            キャンセル
          </button>
          <button className="px-[1rem] lg:px-[1.5rem] py-[0.625rem] lg:py-[0.75rem] bg-[#2563EB] text-white rounded-lg text-[0.75rem] lg:text-[0.875rem] font-mono font-semibold hover:bg-[#1D4ED8] transition-colors">
            投稿する
          </button>
        </div>
      </div>

      {/* Tips - Hidden on mobile */}
      <div className="hidden lg:block bg-[#FEF3C7] rounded-xl p-[1.5rem]">
        <h3 className="text-[0.875rem] font-semibold text-[#92400E] font-mono mb-[1rem] flex items-center gap-[0.5rem]">
          <FileText className="w-[1.125rem] h-[1.125rem]" />
          質問を投稿するときのヒント
        </h3>
        <ul className="flex flex-col gap-[0.75rem]">
          {tips.map((tip, index) => (
            <li key={index} className="flex items-center gap-[0.75rem] text-[0.875rem] text-[#92400E] font-mono">
              <tip.icon className="w-[1rem] h-[1rem]" />
              {tip.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
