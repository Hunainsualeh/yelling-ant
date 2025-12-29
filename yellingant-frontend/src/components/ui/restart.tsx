import { RotateCcwIcon } from "lucide-react";
import { QuizProgress } from "./quizprogress";

interface RestartSectionProps {
  onRestart?: () => void;
  progress?: number;
  current?: number;
  total?: number;
}

const RestartSection = ({ 
  onRestart, 
  progress = 14.8, 
  current = 1, 
  total = 19 
}: RestartSectionProps) => {
  return (
    <div className="w-full max-w-[798px] mx-auto flex flex-col items-start gap-6 -translate-y-4 animate-fade-in opacity-0 [--animation-delay:200ms]">
      <button 
        onClick={onRestart}
        className="inline-flex items-center gap-2 h-auto p-0 bg-transparent hover:opacity-70 transition-opacity"
      >
        <RotateCcwIcon className="w-[18px] h-[18px] text-[#495565]" />
        <span className="font-['Helvetica','Arial',sans-serif] font-normal text-[#495565] text-base tracking-[-0.31px] leading-6">
          Restart
        </span>
      </button>

      <QuizProgress value={progress} current={current} total={total} />
    </div>
  );
};

export default RestartSection;
