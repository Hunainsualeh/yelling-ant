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

  // Get question text from either field
  const questionText = currentQuestion.question || (currentQuestion as any).text || '';
  
  // Check if any options have images
  const hasImageOptions = currentQuestion.options?.some(opt => opt?.image);

  return (
    <div className="w-full max-w-[798px] mx-auto px-2">
      {/* Visible marker to confirm this file is rendering */}
      
      <div className="mb-6 sm:mb-8 bg-b rounded-lg flex items-center justify-center min-h-[56px] sm:min-h-[64px]">
          <div
            className="w-full rounded-[12px] flex items-center justify-center p-3 sm:p-8"
            style={{
              background: 'linear-gradient(90deg, #FE9A00 0%, #F54900 100%)',
              opacity: 1,
            }}
          >
            <h2
              className="font-helvetica font-bold text-white text-center w-full max-w-[542px] text-[18px] sm:text-[24px] leading-[26px] sm:leading-[30px]"
              style={{
                letterSpacing: '-0.45px',
              }}
            >
              {questionText}
            </h2>
          </div>
      </div>

      {/* Options - Image cards if available, or text buttons */}
      {hasImageOptions ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 px-2">
          {currentQuestion.options?.map((opt: QuizAnswer) => (
            <button
              key={opt.id}
              onClick={() => handleClick(opt.id)}
              className={`relative flex flex-col bg-white rounded-[16px] overflow-hidden cursor-pointer transition-all duration-200 w-full max-w-[379px] mx-auto h-[180px] sm:h-[384px] ${
                selectedAnswer === opt.id ? 'border-2 border-[#AD46FF] shadow-lg' : 'border border-[#FBFBFB]'
              }`}
            >
              <div className="w-full h-[100px] sm:h-[256px] overflow-hidden">
                {opt.image && (
                  <img src={opt.image} alt={opt.label ?? opt.text} className="w-full h-full object-cover" />
                )}
              </div>

              <div
                className="flex flex-col items-center justify-center w-full h-[80px] sm:h-[126px] gap-1 sm:gap-2 p-2 sm:p-6 bg-[#F9FAFB]"
              >
                {opt.label && (
                  <div className="whitespace-nowrap w-full max-w-[121px] text-[13px] sm:text-[16px] leading-[20px] sm:leading-[24px] text-[#1E2939] text-center overflow-visible">
                    {opt.label}
                  </div>
                )}
                <div className="whitespace-nowrap w-full max-w-[246px] text-[12px] sm:text-[16px] leading-[18px] sm:leading-[24px] text-[#696F79] text-center overflow-visible">
                  {opt.text}
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        /* Text-only options - simple button list */
        <div className="flex flex-col gap-2 sm:gap-3 px-2">
          {currentQuestion.options?.map((opt: QuizAnswer) => (
            <button
              key={opt.id}
              onClick={() => handleClick(opt.id)}
              className={`w-full text-left p-4 sm:p-5 md:p-6 rounded-xl border-2 transition-all duration-200 flex items-start gap-3 sm:gap-4 ${
                selectedAnswer === opt.id
                  ? 'border-[#9333ea] bg-[#f3e8ff] shadow-sm'
                  : 'border-[#e5e7eb] bg-white hover:border-[#d1d5db] hover:bg-[#f9fafb]'
              }`}
            >
              <span className="text-sm sm:text-base font-medium text-[#696F79] font-helvetica flex-1">
                {opt.text || opt.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PersonalityQuiz;