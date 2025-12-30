import React, { useState, useEffect } from 'react';
import type { QuizQuestion } from '../types';

type Props = {
  question: QuizQuestion;
  questionIndex?: number;
  totalQuestions?: number;
  selectedAnswer?: string;
  onAnswerSelect: (value: string) => void;
};

const QuizTypeSlider: React.FC<Props> = ({ question, selectedAnswer, onAnswerSelect }) => {
  // Default to middle of range (5 for 1-10)
  const min = question.sliderMin ?? 1;
  const max = question.sliderMax ?? 10;
  const defaultValue = Math.floor((min + max) / 2);
  const [value, setValue] = useState<number>(selectedAnswer ? parseInt(selectedAnswer) : defaultValue);

  // Keep slider value in sync when selectedAnswer prop changes
  useEffect(() => {
    if (selectedAnswer) {
      setValue(parseInt(selectedAnswer));
    }
  }, [selectedAnswer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    setValue(newValue);
    onAnswerSelect(newValue.toString());
  };

  // Get question text from either field
  const questionText = question.question || (question as any).text || '';

  // Calculate percentage for slider fill
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="w-full flex justify-center px-2">
      <div className="w-full max-w-[798px]">
        {/* Hero image with question overlay */}
        {question.image && (
          <div className="relative w-full h-[180px] sm:h-[384px] rounded-[8px] overflow-hidden mb-4">
            <img src={question.image} alt={questionText} className="w-full h-full object-cover" />
            {/* semi-transparent overlay to improve text contrast */}
            <div className="absolute inset-0 bg-black/30" />
            {/* Overlayed question text (centered for stability) */}
            <div className="absolute inset-x-0 top-4 flex items-center justify-center px-4">
              <div className="text-white text-[18px] sm:text-[24px] leading-[24px] sm:leading-[30px] font-bold tracking-tight text-center">
                {questionText}
              </div>
            </div>
          </div>
        )}

        {/* Question without image */}
        {!question.image && questionText && (
          <div className="text-center text-gray-800 font-bold text-[18px] sm:text-[24px] mb-4 sm:mb-6 px-2">
            {questionText}
          </div>
        )}

        {/* Slider Container */}
        <div className="w-full px-2 sm:px-4">
          {/* Current Value Display */}
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-[#FE9A00] to-[#F54900] text-white font-bold text-2xl sm:text-3xl px-6 py-2 rounded-full min-w-[60px] text-center">
              {value}
            </div>
          </div>

          {/* Slider Track */}
          <div className="relative w-full h-3 sm:h-4 mb-4">
            {/* Background track */}
            <div className="absolute w-full h-full bg-[#EFDCFF] rounded-full opacity-40" />
            {/* Active track */}
            <div 
              className="absolute h-full bg-gradient-to-r from-[#FE9A00] to-[#F54900] rounded-full transition-all duration-150"
              style={{ width: `${percentage}%` }}
            />
            {/* Range input */}
            <input
              type="range"
              min={min}
              max={max}
              value={value}
              onChange={handleChange}
              className="absolute w-full h-full opacity-0 cursor-pointer z-10"
              style={{ margin: 0 }}
            />
            {/* Custom thumb */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full border-2 border-[#FE9A00] shadow-lg pointer-events-none transition-all duration-150"
              style={{ left: `calc(${percentage}% - ${percentage > 50 ? '12px' : '8px'})` }}
            />
          </div>

          {/* Min/Max Labels */}
          <div className="flex justify-between text-gray-500 text-sm sm:text-base font-medium">
            <span>{question.sliderMinLabel ?? min}</span>
            <span>{question.sliderMaxLabel ?? max}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizTypeSlider;