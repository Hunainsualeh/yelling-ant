import { useState, useEffect } from "react";
import type { QuizQuestion as QuizQuestionType } from "../types";
import type { QuizResult as QuizResultType } from '../types';
import { QuizResult } from './QuizResult';

type QuizTypeImageOptionsProps = {
  questions: QuizQuestionType[];
  onRestart: () => void;
  // Optional results and title so this component can show the result screen
  results?: QuizResultType[];
  quizTitle?: string;
  // When true render full card wrapper (used when this component is shown standalone)
  fullCard?: boolean;
  // optional callback to inform parent of stats (used to display top-right counter)
  onStatsChange?: (stats: { correctCount: number; answeredCount: number }) => void;
  // optional parent-controlled index + answer callbacks. When provided, the parent controls navigation.
  currentIndex?: number;
  onAnswerSelect?: (answerId: string) => void;
  selectedAnswer?: string | null;
  // a restart key from parent; when it changes the component should reset its internal state
  restartKey?: number;
};

export default function QuizTypeImageOptions({ questions, onRestart, results: _results, quizTitle, fullCard = false, onStatsChange, currentIndex: currentIndexProp, onAnswerSelect, selectedAnswer, restartKey }: QuizTypeImageOptionsProps) {
  const [internalIndex, setInternalIndex] = useState(0); // Start from 0 for array index
  const [selected, setSelected] = useState<string | null>(null);
  const [answeredCorrect, setAnsweredCorrect] = useState<Record<number, boolean>>({});
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [completedResult, setCompletedResult] = useState<QuizResultType | null>(null);
  const [completedScore, setCompletedScore] = useState<number | undefined>(undefined);

  // Determine which index to use: parent-controlled or internal
  const currentIndex = typeof currentIndexProp === 'number' ? currentIndexProp : internalIndex;
  // Get current question
  const currentQuestion = questions[currentIndex];
  // const totalQuestions = questions.length; // not currently used
  const correctCount = Object.values(answeredCorrect).filter(Boolean).length;
  const answeredCount = Object.keys(selectedAnswers).length;

  // Notify parent of stats changes so parent can display a top-right counter for image-options
  useEffect(() => {
    if (typeof onStatsChange === 'function') {
      onStatsChange({ correctCount, answeredCount });
    }
  }, [correctCount, answeredCount, onStatsChange]);

  // Handle option selection
  const handleSelect = (id: string) => {
    if (selected) return; // prevent changing selection after first pick
    const opt = currentQuestion.options?.find((o) => o && o.id === id);
    const isCorrect = Boolean(opt?.correct);
    setSelected(id);
    setAnsweredCorrect((prev) => ({ ...prev, [currentIndex]: isCorrect }));
    setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: id }));

    // Notify parent of the answer if parent provided a handler. Do NOT auto-advance — Next button controls navigation.
    if (typeof onAnswerSelect === 'function') {
      onAnswerSelect(id);
    }
  };

  // Sync selection when parent-controlled selectedAnswer or currentIndex changes
  useEffect(() => {
    if (typeof selectedAnswer !== 'undefined' && selectedAnswer !== null) {
      setSelected(selectedAnswer);
    } else {
      // if parent didn't provide a selectedAnswer, fallback to any stored selectedAnswers for this index
      setSelected(selectedAnswers[currentIndex] ?? null);
    }
  }, [selectedAnswer, currentIndex]);

  // Reset internal state when parent requests a restart
  useEffect(() => {
    if (typeof restartKey === 'number') {
      setInternalIndex(0);
      setSelected(null);
      setAnsweredCorrect({});
      setSelectedAnswers({});
      setCompletedResult(null);
      setCompletedScore(undefined);
    }
  }, [restartKey]);

  // Handle restart
  const handleRestart = () => {
    setInternalIndex(0);
    setSelected(null);
    setAnsweredCorrect({});
    setSelectedAnswers({});
    setCompletedResult(null);
    setCompletedScore(undefined);
    onRestart();
  };



  // If we have a computed result, show the QuizResult screen
  if (completedResult) {
    return (
      <div className="w-full px-4 py-8">
        <QuizResult
          result={completedResult}
          quizTitle={quizTitle ?? 'Quiz Result'}
          onRestart={handleRestart}
          score={completedScore}
        />
      </div>
    );
  }

  const inner = (
    <div className="flex flex-col gap-[22px] w-full">

      {/* Question Container */}
      <div>
        {currentQuestion.text ? (
          <div className="font-helvetica text-normal text-center text-gray-700 text-[18px] sm:text-[24px] leading-relaxed w-full max-w-[760px] mx-auto whitespace-pre-line break-words px-2">
            {currentQuestion.text}
          </div>
        ) : (
          <div className="font-helvetica text-center text-gray-700 font-medium text-sm mb-2">Who is this celebrity?</div>
        )}
      </div>

      {/* Question */}
      <div>
        <div className="w-full rounded-lg bg-[linear-gradient(90deg,#FE9A00_0%,#F54900_100%)]">
          <div className="font-helvetica text-center text-white font-bold text-[18px] sm:text-[24px] py-3 sm:py-4 px-3 sm:px-4">{currentQuestion.question}</div>
        </div>
      </div>

      {/* Options Container */}
      <div className="flex flex-col items-center gap-2 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 mb-2 w-full max-w-[900px] mx-auto px-2">
          {(currentQuestion.options ?? []).map((opt) => {
            const isSelected = selected === opt.id;
            const showFeedback = selected !== null;
            let borderColor = "border-gray-200";

            if (isSelected) {
              borderColor = "border-[#9333ea] bg-[#f3e8ff]";
            }

            return (
              <div
                key={opt.id}
                onClick={() => handleSelect(opt.id)}
                className={`relative flex flex-col items-center w-full max-w-[379px] mx-auto aspect-square bg-white rounded-[12px] border-2 ${borderColor} shadow-sm cursor-pointer transition-transform duration-200 ${showFeedback && !isSelected ? 'opacity-60' : 'opacity-100'} ${showFeedback ? 'pointer-events-none' : 'pointer-events-auto'}`}
                style={{ minWidth: '140px', minHeight: '140px' }}
              >
                {/* Selection Badge - Check or X */}
                {showFeedback && (
                  <div className={`absolute top-2 right-2 z-10 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${isSelected ? 'bg-green-500' : 'bg-red-500'}`}>
                    {isSelected ? (
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                )}
                <div className="w-full text-center px-2 sm:px-4 py-2 sm:py-4 bg-[#F9FAFB]">
                  <span className="font-helvetica text-[18px] sm:text-[24px] font-bold text-[#461799]">{opt.label ?? opt.text}</span>
                </div>
                <div className="w-full flex-1 overflow-hidden rounded-b-[12px]">
                  <img src={opt.image} alt={opt.label ?? opt.text ?? 'option'} className="w-full h-full object-cover" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Wrong Answer Container - Removed for no correct/wrong feedback */}
      <div className="w-full mt-4">
          <div className="min-h-[88px]" />
      </div>
    </div>
  );

  if (fullCard) {
    return (
      <div className="mx-auto mt-10 w-full max-w-[846px] min-h-[600px] rounded-[24px] border border-[#E5E7EB] bg-white box-border shadow-lg relative z-10 p-4 font-['Helvetica','Arial',sans-serif]">
        {inner}
      </div>
    );
  }

  return inner;
}