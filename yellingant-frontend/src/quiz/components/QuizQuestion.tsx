import React from 'react';
import type { QuizQuestion as QuizQuestionType } from '../types';

interface QuizQuestionProps {
  question: QuizQuestionType;
  selectedAnswer: string | string[] | undefined;
  onAnswerSelect: (answerId: string) => void;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  selectedAnswer,
  onAnswerSelect,
}) => {
  const isSelected = (answerId: string) => {
    if (Array.isArray(selectedAnswer)) {
      return selectedAnswer.includes(answerId);
    }
    return selectedAnswer === answerId;
  };

  // Prevent duplicate options: skip rendering options for image-choice and image-options types
  if (question.type === 'image-choice' || question.type === 'image-options') {
    return null;
  }

  // Get question text - backend sends 'text', frontend uses 'question'
  const questionText = question.question || (question as any).text || '';

  // Text-based multiple choice (A, B, C, D format)
  return (
    <div className="w-full max-w-[798px] mx-auto px-2 sm:px-4">
      {/* Question Text */}
      <div className="mb-6 sm:mb-8 -translate-y-4 animate-fade-in opacity-0 text-center bg-black rounded-lg">
        <h2 className="text-[16px] sm:text-[18px] md:text-[24px] font-bold font-helvetica text-white py-3 sm:py-4 px-3 sm:px-6">
          {questionText}
        </h2>
      </div>

      {/* Question Image (if exists) */}
      {question.image && (
        <div className="mb-6 sm:mb-8 rounded-xl overflow-hidden -translate-y-4 animate-fade-in opacity-0 [--animation-delay:100ms]">
          <img
            src={question.image}
            alt="Question"
            className="w-full h-auto object-cover max-h-[280px] sm:max-h-[400px]"
          />
        </div>
      )}

      {/* Answer Options */}
      <div className="space-y-2 sm:space-y-3">
        {question.options?.map((option, index) => {
          return (
            <button
              key={option.id}
              onClick={() => onAnswerSelect(option.id)}
              className={`w-full text-left p-4 sm:p-5 md:p-6 rounded-xl border-2 transition-all duration-200 -translate-y-4 animate-fade-in opacity-0 flex items-start gap-3 sm:gap-4 ${
                isSelected(option.id)
                  ? 'border-[#9333ea] bg-[#f3e8ff] shadow-sm'
                  : 'border-[#e5e7eb] bg-white hover:border-[#d1d5db] hover:bg-[#f9fafb]'
              }`}
              style={{
                animationDelay: `${(index + 2) * 100}ms`,
              }}
            >
              {option.image ? (
                <div className="flex items-center gap-3 sm:gap-4 flex-1">
                  <img
                    src={option.image}
                    alt={option.text}
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover flex-shrink-0"
                  />
                  <span className="text-sm sm:text-base font-medium text-[#696F79] font-helvetica">
                    {option.text}
                  </span>
                </div>
              ) : (
                <span className="text-sm sm:text-base font-medium text-[#696F79] font-helvetica flex-1">
                  {option.text}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
