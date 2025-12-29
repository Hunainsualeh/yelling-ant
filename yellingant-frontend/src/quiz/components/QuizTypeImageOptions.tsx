import { useState, useEffect } from "react";
import type { QuizQuestion as QuizQuestionType } from "../types";
import type { QuizResult as QuizResultType } from '../types';
import WrongAnswerNotice from "../../components/ui/WrongAnswerNotice";
import CorrectAnswerNotice from "../../components/ui/CorrectAnswerNotice";
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
          <div className=" font-helvetica text-normal text-center text-gray-700 text-[24px] leading-relaxed w-full max-w-[760px] mx-auto whitespace-pre-line break-words">
            {currentQuestion.text}
          </div>
        ) : (
          <div className="font-helvetica text-center text-gray-700 font-medium text-sm mb-2">Who is this celebrity?</div>
        )}
      </div>

      {/* Question */}
      <div>
        <div className="w-full rounded-lg bg-[linear-gradient(90deg,#FE9A00_0%,#F54900_100%)]">
          <div className=" font-helvetica text-center text-white font-bold text-[24px] py-4 px-4">{currentQuestion.question}</div>
        </div>
      </div>

      {/* Options Container */}
      <div className="flex flex-col items-center gap-2 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-2 w-full max-w-[900px] mx-auto px-2">
          {(currentQuestion.options ?? []).map((opt) => {
            const isSelected = selected === opt.id;
            const isCorrect = Boolean(opt.correct);
            const showFeedback = selected !== null;
            let borderColor = "border-gray-200";
            let icon = null;

            if (showFeedback && isSelected && isCorrect) {
              borderColor = "border-green-500";
              icon = (
                <span className="absolute top-2 right-2 text-green-500 text-2xl font-bold">✔</span>
              );
            } else if (showFeedback && isSelected && !isCorrect) {
              borderColor = "border-red-500";
              icon = (
                <span className="absolute top-2 right-2 text-red-500 text-2xl font-bold">✖</span>
              );
            }

            return (
              <div
                key={opt.id}
                onClick={() => handleSelect(opt.id)}
                className={`relative flex flex-col items-center w-full max-w-[379px] aspect-square bg-white rounded-[12px] border-2 ${borderColor} shadow-sm cursor-pointer transition-transform duration-200 ${showFeedback && !isSelected ? 'opacity-60' : 'opacity-100'} ${showFeedback ? 'pointer-events-none' : 'pointer-events-auto'}`}
                style={{ minWidth: '160px', minHeight: '160px' }}
              >
                <div className="w-full text-center px-4 py-4 bg-[#F9FAFB] ">
                  <span className="font-helvetica text-[24px] font-bold text-[#461799]">{opt.label ?? opt.text}</span>
                </div>
                <div className="w-full flex-1 overflow-hidden rounded-b-[12px]">
                  <img src={opt.image} alt={opt.label ?? opt.text ?? 'option'} className="w-full h-full object-cover" />
                </div>
                {icon}
              </div>
            );
          })}
        </div>
      </div>

      {/* Wrong Answer Container */}
      <div className="w-full mt-4">
        {selected ? (
          currentQuestion.options?.find(opt => opt && opt.id === selected)?.correct ? (
            <CorrectAnswerNotice message={currentQuestion.feedback?.correct ?? currentQuestion.options?.find(opt => opt && opt.id === selected)?.label ?? currentQuestion.options?.find(opt => opt && opt.id === selected)?.text ?? 'Correct!'} />
          ) : (
            <WrongAnswerNotice message={currentQuestion.feedback?.incorrect ?? currentQuestion.options?.find(opt => opt && opt.id === selected)?.label ?? currentQuestion.options?.find(opt => opt && opt.id === selected)?.text ?? 'That was incorrect.'} />
          )
        ) : (
          <div className="min-h-[88px]" />
        )}
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