import React, { useState, useEffect } from 'react';
import type { QuizQuestion } from '../types';

type Props = {
  question: QuizQuestion;
  questionIndex?: number;
  totalQuestions?: number;
  selectedAnswer?: string;
  onAnswerSelect: (value: string) => void;
};

const QuizTypeTextInput: React.FC<Props> = ({ question, selectedAnswer, onAnswerSelect }) => {
  const [value, setValue] = useState(selectedAnswer ?? '');

  // Keep local textarea value in sync when selectedAnswer prop changes
  useEffect(() => {
    setValue(selectedAnswer ?? '');
  }, [selectedAnswer]);

  const handleSubmit = () => {
    if (value.trim() === '') return;
    onAnswerSelect(value.trim());
  };


  return (
    <div className="w-full flex justify-center px-2">
      <div className="w-full max-w-[798px]">
      {/* Hero image with question overlay */}
      {question.image && (
        <div className="relative w-full h-[180px] sm:h-[384px] rounded-[8px] overflow-hidden mb-4">
          <img src={question.image} alt={question.question} className="w-full h-full object-cover" />

          {/* semi-transparent overlay to improve text contrast */}
          <div className="absolute inset-0 bg-black/30" />

          {/* Overlayed question text (centered for stability) */}
          <div className="absolute inset-x-0 top-4 flex items-center justify-center">
            <div className="text-white text-[24px] leading-[30px] font-bold tracking-tight text-center">
              {question.question}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div>
        <input
          type="text"
          value={value}
          onChange={(e) => {
            const v = e.target.value;
            setValue(v);
            const trimmed = v.trim();
            if (trimmed !== '') {
              onAnswerSelect(trimmed);
            } else {
              onAnswerSelect('');
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSubmit();
            }
          }}
          placeholder="Your Answer"
          className="w-full h-[44px] sm:h-[50px] px-4 py-3 rounded-[12px] border border-[#E5E7EB] text-gray-700 focus:outline-none"
        />

        
      </div>
    </div>
  </div>
  );
};

export default QuizTypeTextInput;
