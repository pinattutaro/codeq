import { ChevronUp, ChevronDown, Check, MessageSquare, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const question = {
  id: '1',
  title: 'ReactでuseStateの値が更新されない問題',
  content: `useStateで状態を更新しても、コンソールログには古い値が表示されます。

例えば、以下のようなコードがあるとします：

\`\`\`javascript
const [count, setCount] = useState(0);

const handleClick = () => {
  setCount(count + 1);
  console.log(count); // ここでは古い値が表示される
};
\`\`\`

なぜ更新が即座に反映されないのでしょうか？`,
  tags: [
    { name: 'React', color: 'bg-[#F59E0B]/20 text-[#F59E0B]' },
    { name: 'JavaScript', color: 'bg-[#2563EB]/20 text-[#2563EB]' },
  ],
  author: { name: 'tanaka_dev' },
  votes: 12,
  createdAt: '1時間前',
};

const answers = [
  {
    id: 'a1',
    content: `これはReactの仕様によるものです。setStateはバッチ処理で非同期的に実行されます。

解決策として、useEffectを使用して状態変更を監視するか、setStateのコールバック形式を使用してください：

\`\`\`javascript
setCount(prevCount => prevCount + 1);
\`\`\`

また、最新の値が必要な場合は、useRefを併用する方法もあります。`,
    author: { name: 'react_master' },
    votes: 15,
    createdAt: '30分前',
    isAccepted: true,
  },
];

export default function QuestionDetailPage() {
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
          <button className="text-[#9CA3AF] hover:text-[#2563EB]">
            <ChevronUp className="w-[1.5rem] h-[1.5rem] lg:w-[2rem] lg:h-[2rem]" />
          </button>
          <span className="text-[1.125rem] lg:text-[1.25rem] font-bold text-[#1A1A1A]">{question.votes}</span>
          <button className="text-[#9CA3AF] hover:text-[#DC2626]">
            <ChevronDown className="w-[1.5rem] h-[1.5rem] lg:w-[2rem] lg:h-[2rem]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h1 className="text-[clamp(1.125rem,2.5vw,1.5rem)] font-bold font-display text-[#1A1A1A] mb-[0.75rem] lg:mb-[1rem]">
            {question.title}
          </h1>
          <div className="prose font-mono text-[0.75rem] lg:text-[0.875rem] text-[#666666] mb-[0.75rem] lg:mb-[1rem] whitespace-pre-wrap overflow-x-auto">
            {question.content}
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
              <button className="text-[#9CA3AF] hover:text-[#2563EB]">
                <ChevronUp className="w-[1.25rem] h-[1.25rem] lg:w-[1.5rem] lg:h-[1.5rem]" />
              </button>
              <span className="text-[1rem] lg:text-[1.125rem] font-bold text-[#1A1A1A]">{answer.votes}</span>
              <button className="text-[#9CA3AF] hover:text-[#DC2626]">
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
                {answer.content}
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
        <textarea
          placeholder="回答を入力してください..."
          className="w-full h-[6rem] lg:h-[8rem] px-[0.75rem] lg:px-[1rem] py-[0.5rem] lg:py-[0.75rem] rounded-lg border border-[#E5E7EB] text-[0.75rem] lg:text-[0.875rem] font-mono outline-none focus:border-[#2563EB] transition-colors resize-none mb-[0.75rem] lg:mb-[1rem]"
        />
        <button className="w-full lg:w-auto px-[1rem] lg:px-[1.5rem] py-[0.625rem] lg:py-[0.75rem] bg-[#2563EB] text-white rounded-lg text-[0.75rem] lg:text-[0.875rem] font-mono font-semibold hover:bg-[#1D4ED8] transition-colors">
          回答を投稿
        </button>
      </div>
    </div>
  );
}
