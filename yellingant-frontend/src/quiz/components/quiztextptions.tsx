import React, { useEffect } from 'react';
import type { QuizQuestion as QuizQuestionType, QuizAnswer } from '../types';
import AdSlot from '../../components/ui/AdSlot';

type QuizTextOptionsProps = {
  questions: QuizQuestionType[];
  currentIndex?: number;
  selectedAnswer?: string | null;
  onAnswerSelect?: (id: string) => void;
  restartKey?: number;
};

const QuizTextOptions: React.FC<QuizTextOptionsProps> = ({
  questions,
  currentIndex = 0,
  selectedAnswer,
  onAnswerSelect,
  restartKey,
}) => {
  useEffect(() => {
    // placeholder for restart animations
  }, [restartKey]);

  const currentQuestion = questions?.[currentIndex];
  if (!currentQuestion) return null;

  const handleClick = (id: string) => {
    if (typeof onAnswerSelect === 'function') onAnswerSelect(id);
  };

  return (
    <div className="w-full max-w-[798px] mx-auto px-2">
      <div className="">
       
      </div>
        <div className="mb-8 flex items-center justify-center">
          <div className="w-full min-h-[64px] rounded-[12px] flex items-center justify-center p-4 sm:p-8">
            <h2 className="w-full max-w-[320px] text-[20px] sm:text-[24px] leading-[29px] text-center text-[#101828] font-normal font-helvetica">
              {currentQuestion.question}
            </h2>
          </div>
        </div>

      <div className="w-full flex justify-center mb-6 px-2">
        <AdSlot slotId="quiz-main" variant="quiz-banner" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 justify-center">
        {currentQuestion.options?.map((opt: QuizAnswer, idx: number) => {
          const letter = String.fromCharCode(65 + idx); // A, B, C...
          return (
            <button
              key={opt.id}
              onClick={() => handleClick(opt.id)}
                className={`relative flex flex-row bg-white rounded-[12px] border transition-shadow duration-150 p-4 items-center gap-4 cursor-pointer w-full max-w-[379px] font-['Helvetica','Arial',sans-serif] text-[18px] sm:text-[24px] font-normal ${
                selectedAnswer === opt.id ? 'border-[#AD46FF] shadow-lg' : 'border-[#EDEDED]'
              }`}
            >
                <div className="flex-shrink-0 flex items-center justify-center rounded-full bg-white w-10 h-10 shadow-sm">
                  <span className="font-['Helvetica','Arial',sans-serif] font-bold text-sm text-[#101828]">{letter}</span>
                </div>

                <div className="flex-1 text-left overflow-visible">
                  <div className="w-full max-w-[204px] min-h-[32px] text-[14px] sm:text-[16px] leading-[24px] text-[#696F79] break-words">
                    {opt.label ?? opt.text}
                  </div>
                </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuizTextOptions;
