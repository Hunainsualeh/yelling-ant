interface QuizProgressProps {
  value?: number;
  current?: number;
  total?: number;
}

export const QuizProgress = ({ value = 14.8, current = 1, total = 19 }: QuizProgressProps) => {
  return (
    <div className="w-full max-w-[798px] mx-auto h-6 relative -translate-y-4 animate-fade-in opacity-0">
      <div className="h-6 bg-[#f9fafb] rounded-full">
        <div
          className="h-6 bg-[#8b2e1a] rounded-full transition-all duration-500"
          style={{ width: `${value}%` }}
        />
      </div>
      <div className="absolute top-0.5 left-1/2 -translate-x-1/2 font-['Helvetica','Arial',sans-serif] font-normal text-[#8b2e1a] text-sm text-center tracking-[-0.15px] leading-5 whitespace-nowrap">
        {current} of {total}
      </div>
    </div>
  );
};
