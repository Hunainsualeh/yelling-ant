import React, { useEffect } from 'react';
import type { QuizQuestion as QuizQuestionType, QuizAnswer } from '../types';

type PersonalityProps = {
  questions: QuizQuestionType[];
  currentIndex?: number;
  selectedAnswer?: string | null;
  onAnswerSelect?: (id: string) => void;
  restartKey?: number;
  results?: any[];
  quizTitle?: string;
};

const PersonalityQuiz: React.FC<PersonalityProps> = ({
  questions,
  currentIndex = 0,
  selectedAnswer,
  onAnswerSelect,
  restartKey,
}) => {
  // Reset local effects on restartKey if needed in future
  useEffect(() => {
    // placeholder for animation reset
  }, [restartKey]);

  const currentQuestion = questions?.[currentIndex];
  if (!currentQuestion) return null;

  const handleClick = (id: string) => {
    if (typeof onAnswerSelect === 'function') onAnswerSelect(id);
  };

  return (
    <div className="w-full max-w-[798px] mx-auto px-2">
      {/* Visible marker to confirm this file is rendering */}
      
      <div className="mb-8 bg-b rounded-lg flex items-center justify-center min-h-[64px]">
          <div
            className="w-full rounded-[12px] flex items-center justify-center p-4 sm:p-8"
            style={{
              background: 'linear-gradient(90deg, #FE9A00 0%, #F54900 100%)',
              opacity: 1,
            }}
          >
            <h2
              className="font-helvetica font-bold text-white text-center w-full max-w-[542px] text-[20px] sm:text-[24px] leading-[30px]"
              style={{
                letterSpacing: '-0.45px',
              }}
            >
              {currentQuestion.question}
            </h2>
          </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {currentQuestion.options?.map((opt: QuizAnswer) => (
          <button
            key={opt.id}
            onClick={() => handleClick(opt.id)}
            className={`relative flex flex-col bg-white rounded-[16px] overflow-hidden cursor-pointer transition-all duration-200 w-full max-w-[379px] h-[220px] sm:h-[384px] ${
              selectedAnswer === opt.id ? 'border-[#AD46FF] shadow-lg' : 'border-[1px] border-[#FBFBFB]'
            }`}
          >
            <div className="w-full h-[120px] sm:h-[256px] overflow-hidden">
              {opt.image && (
                <img src={opt.image} alt={opt.label ?? opt.text} className="w-full h-full object-cover" />
              )}
            </div>

            <div
              className="flex flex-col items-center justify-center w-full h-[80px] sm:h-[126px] gap-2 p-2 sm:p-6 bg-[#F9FAFB]"
            >
              <div
                className="whitespace-nowrap w-full max-w-[121px] text-[14px] sm:text-[16px] leading-[24px] text-[#1E2939] text-center overflow-visible"
              >
                {opt.label}
              </div>

              <div
                className="whitespace-nowrap w-full max-w-[246px] text-[14px] sm:text-[16px] leading-[24px] text-[#696F79] text-center overflow-visible"
              >
                {opt.text}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PersonalityQuiz;