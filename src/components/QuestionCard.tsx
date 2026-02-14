import Link from 'next/link';

interface QuestionCardProps {
  id: string;
  title: string;
  excerpt: string;
  tags: { name: string; color: string }[];
  author: {
    name: string;
    avatar?: string;
  };
  votes: number;
  answers: number;
  views: number;
  createdAt: string;
  hasAcceptedAnswer?: boolean;
}

export default function QuestionCard({
  id,
  title,
  excerpt,
  tags,
  author,
  votes,
  answers,
  views,
  createdAt,
  hasAcceptedAnswer = false,
}: QuestionCardProps) {
  return (
    <Link href={`/question/${id}`} className="block">
      <div className="bg-white rounded-xl p-[1.25rem] flex gap-[1rem] hover:shadow-md transition-shadow">
        {/* Vote Section */}
        <div className="flex flex-col items-center gap-[0.25rem] w-[3.75rem]">
          <span className="text-[1.25rem] font-bold text-[#1A1A1A]">{votes}</span>
          <span className="text-[0.75rem] text-[#6B7280] font-mono">投票</span>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col gap-[0.5rem]">
          <h3 className="text-[1rem] font-bold text-[#1A1A1A] font-display hover:text-[#2563EB]">
            {title}
          </h3>
          <p className="text-[0.875rem] text-[#666666] font-mono line-clamp-2">{excerpt}</p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-[0.5rem] mt-[0.25rem]">
            {tags.map((tag) => (
              <span
                key={tag.name}
                className={`px-[0.5rem] py-[0.25rem] rounded text-[0.75rem] font-mono ${tag.color}`}
              >
                {tag.name}
              </span>
            ))}
          </div>

          {/* Meta */}
          <div className="flex items-center justify-between mt-[0.5rem]">
            <div className="flex items-center gap-[0.5rem]">
              <div className="w-[1.5rem] h-[1.5rem] bg-[#2563EB] rounded-full flex items-center justify-center">
                <span className="text-white text-[0.75rem] font-bold">
                  {author.name.charAt(0)}
                </span>
              </div>
              <span className="text-[0.75rem] text-[#666666] font-mono">{author.name}</span>
              <span className="text-[0.75rem] text-[#9CA3AF] font-mono">{createdAt}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-col items-end gap-[0.25rem] min-w-[3.75rem]">
          <div className={`text-[0.875rem] font-mono ${hasAcceptedAnswer ? 'text-[#059669]' : 'text-[#666666]'}`}>
            <span className="font-bold">{answers}</span>
            <span className="text-[0.75rem] ml-[0.25rem]">回答</span>
          </div>
          <div className="text-[0.875rem] text-[#9CA3AF] font-mono">
            <span>{views}</span>
            <span className="text-[0.75rem] ml-[0.25rem]">閲覧</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
