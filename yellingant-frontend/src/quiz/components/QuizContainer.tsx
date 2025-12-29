import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import AdSlot from '../../components/ui/AdSlot';
import AdContainer from '../../components/ui/AdContainer';
import QuizCategories from '../../sections/QuizCategories';
import QuizTypeImageOptions from './QuizTypeImageOptions';
import { QuizQuestion } from './QuizQuestion';
import QuizTypeTextInput from './QuizTypeTextInput';
import QuizTypeSlider from './QuizTypeSlider';
import QuizTypeFigmaQuestion from './QuizTypeFigmaQuestion';
import Personality from './personality';
import QuizTextOptions from './quiztextptions';
import { QuizResult } from './QuizResult';
import { JoinYellingAntButton, NextButton, RestartButton } from '../../components/ui/next';
import type { QuizData } from '../types';
import computeResult from '../utils/computeResult';
import Navbar from '../../components/layout/Navbar';

type QuizContainerProps = {
  quizData: QuizData;
};

type QuizState = {
  currentQuestionIndex: number;
  answers: Record<number, string | string[]>;
  score: number;
  result: any;
  isCompleted: boolean;
};

const QuizContainer: React.FC<QuizContainerProps> = ({ quizData }) => {
  const initialQuizState: QuizState = {
    currentQuestionIndex: 0,
    answers: {},
    score: 0,
    result: null,
    isCompleted: false,
  };

  const [quizState, setQuizState] = useState<QuizState>(initialQuizState);
  const [imageRestartKey, setImageRestartKey] = useState(0);
  const [imageStats, setImageStats] = useState<{ correctCount: number; answeredCount: number } | null>(null);
  const navigate = useNavigate();

  const handleAnswerSelect = (answerId: string | string[]) => {
    setQuizState((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [prev.currentQuestionIndex]: answerId,
      },
    }));
  };

  const handleNext = () => {
    const nextIndex = quizState.currentQuestionIndex + 1;
    if (nextIndex >= quizData.questions.length) {
      const result = computeResult(quizData, quizState.answers);

      let percentScore = 0;
      if (quizData.type === 'scored') {
        let sum = 0;
        let count = 0;
        Object.values(quizState.answers).forEach((answerId) => {
          const n = Array.isArray(answerId) ? Number(answerId[0]) : Number(answerId);
          if (!isNaN(n)) {
            sum += n;
            count += 1;
          }
        });
        percentScore = count > 0 ? Math.round(sum / count) : 0;
      } else if (quizData.type === 'trivia') {
        let correctAnswers = 0;
        Object.entries(quizState.answers).forEach(([qIndex, answerId]) => {
          const question = quizData.questions[parseInt(qIndex, 10)];
          if (!question) return;
          if (question.type === 'text-input' && typeof answerId === 'string' && question.correctAnswer) {
            const expected = String(question.correctAnswer).trim().toLowerCase();
            const given = String(answerId).trim().toLowerCase();
            if (expected === given) correctAnswers++;
            return;
          }
          if (question?.correctAnswer === answerId) {
            correctAnswers++;
          }
        });
        percentScore = Math.round((correctAnswers / quizData.questions.length) * 100);
      }

      // redirect to result page and pass result via location state
      navigate(`/quiz/${quizData.slug}/result`, { state: { result, quizTitle: quizData.title, score: percentScore } });
      return;
    } else {
      setQuizState((prev) => ({ ...prev, currentQuestionIndex: nextIndex }));
    }
  };

  const handleRestart = () => {
    setQuizState({ currentQuestionIndex: 0, answers: {}, score: 0, result: null, isCompleted: false });
    setImageRestartKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentQuestion = quizData.questions[quizState.currentQuestionIndex];
  // Debug: log quiz & question types so we can confirm which component branch runs
  // Remove or comment out after debugging
  // eslint-disable-next-line no-console
  console.log('QuizContainer debug ->', { slug: quizData.slug, quizType: quizData.type, questionType: currentQuestion?.type, currentQuestion });
  const currentAnswer = quizState.answers[quizState.currentQuestionIndex];

  if (quizState.isCompleted) {
    return (
      <div className="min-h-screen bg-white flex flex-col overflow-x-hidden">
        <div className="w-full flex justify-center py-12 px-0">
          <div className="w-full max-w-[846px] mx-auto">
            <QuizResult result={quizState.result} quizTitle={quizData.title} onRestart={handleRestart} score={quizState.score} />
          </div>
        </div>
        <Footer />
        <AdContainer heightClass="h-[266px]" widthClass="w-full max-w-none" className="rounded-tl-[4px] rounded-tr-[4px] m-0">
          <AdSlot slotId="YA_QHOME_FEED_003" />
        </AdContainer>
      </div>
    );
  }

  const totalQuestions = quizData.questions.length;
  const questionNumber = quizState.currentQuestionIndex + 1;
  const isMinimalFigmaQuiz = quizData.slug !== 'order-a-feast-figma' && quizData.questions.every((q) => q.type === 'figma-image');

  if (isMinimalFigmaQuiz) {
    return (
      <div className="min-h-screen bg-white flex flex-col overflow-x-hidden">
        <div className="w-full flex justify-center px-0">
          <div className="w-full max-w-none">
            <QuizCategories />
          </div>
        </div>
        
        <div className="w-full px-0 py-8">
          <div className="w-full max-w-[1440px] mx-auto grid grid-cols-1 xl:grid-cols-[1fr_846px_1fr] gap-4 items-start px-0">
            {/* Left Ad (desktop only) */}
            <div className="hidden xl:flex items-center justify-center sticky top-8">
              <AdSlot variant="vertical-cards" />
            </div>
            
            {/* Main Quiz Card */}
            <div className="flex justify-center">
              <div className="w-full max-w-[846px] rounded-2xl border border-[#E5E5E5] bg-white shadow-sm p-6 font-sans flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <RestartButton onClick={handleRestart} />
                  {quizData.type === 'image-options' && imageStats ? (
                    <div className="text-sm font-medium text-gray-600">
                      Correct: {imageStats.correctCount}
                    </div>
                  ) : null}
                </div>
                
                {/* Progress Bar */}
                <div className="w-full flex justify-center">
                  <div className="relative w-full h-6 rounded-full bg-gray-100 overflow-hidden">
                    <div 
                      className="absolute left-0 top-0 h-full rounded-full transition-all duration-300 ease-out bg-[#7C3AED]" 
                      style={{ width: `${(questionNumber / totalQuestions) * 100}%` }} 
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-medium text-[#7C3AED]">{questionNumber}/{totalQuestions}</span>
                    </div>
                  </div>
                </div>
                
                {/* Question Content */}
                <div className="w-full flex flex-col gap-6">
                  {quizData.slug === 'build-a-pizza' ? (
                    <QuizQuestion
                      question={currentQuestion}
                      selectedAnswer={currentAnswer as string}
                      onAnswerSelect={(id: string) => handleAnswerSelect(id)}
                    />
                  ) : quizData.type === 'personality' || quizData.slug === 'chaos-animals' ? (
                    quizData.slug === 'chaos-animals' ? (
                      <QuizTextOptions
                        questions={quizData.questions}
                        currentIndex={quizState.currentQuestionIndex}
                        onAnswerSelect={(val: string) => handleAnswerSelect(val)}
                        selectedAnswer={currentAnswer as string}
                        restartKey={imageRestartKey}
                      />
                    ) : (
                      <Personality
                        questions={quizData.questions}
                        results={quizData.results}
                        quizTitle={quizData.title}
                        currentIndex={quizState.currentQuestionIndex}
                        onAnswerSelect={(val: string) => handleAnswerSelect(val)}
                        selectedAnswer={currentAnswer as string}
                        restartKey={imageRestartKey}
                      />
                    )
                  ) : quizData.type === 'image-options' ? (
                    <QuizTypeImageOptions
                      questions={quizData.questions}
                      onRestart={handleRestart}
                      results={quizData.results}
                      quizTitle={quizData.title}
                      fullCard={true}
                      onStatsChange={setImageStats}
                      restartKey={imageRestartKey}
                      currentIndex={quizState.currentQuestionIndex}
                      onAnswerSelect={handleAnswerSelect}
                      selectedAnswer={currentAnswer as string}
                    />
                  ) : currentQuestion.type === 'text-input' ? (
                    <QuizTypeTextInput
                      question={currentQuestion}
                      selectedAnswer={currentAnswer as string}
                      onAnswerSelect={(val: string) => handleAnswerSelect(val)}
                    />
                  ) : currentQuestion.type === 'figma-image' ? (
                    <QuizTypeFigmaQuestion
                      question={currentQuestion}
                      selectedAnswer={currentAnswer as string}
                      onAnswerSelect={(val: string) => handleAnswerSelect(val)}
                    />
                  ) : currentQuestion.type === 'slider' ? (
                    <QuizTypeSlider
                      question={currentQuestion}
                      selectedAnswer={currentAnswer as string}
                      onAnswerSelect={(val: string) => handleAnswerSelect(val)}
                    />
                  ) : (
                    <QuizQuestion
                      question={currentQuestion}
                      selectedAnswer={currentAnswer as string}
                      onAnswerSelect={(id: string) => handleAnswerSelect(id)}
                    />
                  )}
                </div>
                
                {/* Bottom Action Buttons */}
                {quizData.type !== 'image-options' && (
                  <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <div className="flex-1">
                      <JoinYellingAntButton onClick={() => window.open('https://yellingant.com', '_blank')} />
                    </div>
                    <div className="flex-1">
                      <NextButton onClick={handleNext} disabled={!currentAnswer} />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Right Ad (desktop only) */}
            <div className="hidden xl:flex items-center justify-center sticky top-8">
              <AdSlot variant="vertical-cards" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white flex flex-col overflow-x-hidden">
      <Header />
      <Navbar />
      <QuizCategories />
      
      {/* Main Quiz Container with Sidebar Ads */}
      <div className="w-full py-8">
        <div className="w-full max-w-[1440px] mx-auto grid grid-cols-1 xl:grid-cols-[1fr_846px_1fr] gap-4 items-start px-0">
          {/* Left Sidebar Ad */}
          <div className="hidden xl:flex items-center justify-center sticky top-8">
            <AdSlot variant="vertical-cards" />
          </div>

          {/* Main Quiz Card */}
          <div className="flex justify-center">
            <div className="w-full max-w-[846px] rounded-2xl border border-[#E5E5E5] bg-white shadow-sm p-6 font-sans">
              <div className="flex flex-col gap-6">
                {/* Header Row: Restart Button & Correct Counter */}
                <div className="flex items-center justify-between">
                  <RestartButton onClick={handleRestart} />
                  {quizData.type === 'image-options' && imageStats ? (
                    <div className="text-sm font-medium text-gray-600">
                      Correct: {imageStats.correctCount}
                    </div>
                  ) : null}
                </div>

                {/* Progress Bar */}
                <div className="w-full flex justify-center">
                  <div className="relative w-full h-6 rounded-full bg-gray-100 overflow-hidden">
                    <div 
                      className="absolute left-0 top-0 h-full rounded-full transition-all duration-300 ease-out bg-[#7C3AED]" 
                      style={{ width: `${(questionNumber / totalQuestions) * 100}%` }} 
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-medium text-[#7C3AED]">
                        {questionNumber}/{totalQuestions}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Question Content Area */}
                <div className="flex flex-col items-center gap-6 w-full">
                  {quizData.slug === 'build-a-pizza' ? (
                    <QuizQuestion
                      question={currentQuestion}
                      selectedAnswer={currentAnswer as string}
                      onAnswerSelect={(id: string) => handleAnswerSelect(id)}
                    />
                  ) : quizData.type === 'personality' || quizData.slug === 'chaos-animals' ? (
                    quizData.slug === 'chaos-animals' ? (
                      <QuizTextOptions
                        questions={quizData.questions}
                        currentIndex={quizState.currentQuestionIndex}
                        onAnswerSelect={(val: string) => handleAnswerSelect(val)}
                        selectedAnswer={currentAnswer as string}
                        restartKey={imageRestartKey}
                      />
                    ) : (
                      <Personality
                        questions={quizData.questions}
                        results={quizData.results}
                        quizTitle={quizData.title}
                        currentIndex={quizState.currentQuestionIndex}
                        onAnswerSelect={(val: string) => handleAnswerSelect(val)}
                        selectedAnswer={currentAnswer as string}
                        restartKey={imageRestartKey}
                      />
                    )
                  ) : currentQuestion.type === 'image-options' || quizData.type === 'image-options' ? (
                    <QuizTypeImageOptions
                      questions={quizData.questions}
                      onRestart={handleRestart}
                      results={quizData.results}
                      quizTitle={quizData.title}
                      onStatsChange={setImageStats}
                      currentIndex={quizState.currentQuestionIndex}
                      onAnswerSelect={(val: string) => handleAnswerSelect(val)}
                      selectedAnswer={currentAnswer as string}
                      restartKey={imageRestartKey}
                    />
                  ) : currentQuestion.type === 'text-input' ? (
                    <QuizTypeTextInput
                      question={currentQuestion}
                      selectedAnswer={currentAnswer as string}
                      onAnswerSelect={(val: string) => handleAnswerSelect(val)}
                    />
                  ) : currentQuestion.type === 'figma-image' ? (
                    <QuizTypeFigmaQuestion
                      question={currentQuestion}
                      selectedAnswer={currentAnswer as string}
                      onAnswerSelect={(val: string) => handleAnswerSelect(val)}
                    />
                  ) : currentQuestion.type === 'slider' ? (
                    <QuizTypeSlider
                      question={currentQuestion}
                      selectedAnswer={currentAnswer as string}
                      onAnswerSelect={(val: string) => handleAnswerSelect(val)}
                    />
                  ) : (
                    <QuizQuestion
                      question={currentQuestion}
                      selectedAnswer={currentAnswer as string}
                      onAnswerSelect={(id: string) => handleAnswerSelect(id)}
                    />
                  )}
                </div>

                {/* Ad Slot */}
                <div className="w-full flex justify-start ">
                  <div className="w-full">
                    <AdSlot slotId="quiz-main" className="w-full" />
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <div className="flex-1">
                    <JoinYellingAntButton onClick={() => window.open('https://yellingant.com', '_blank')} />
                  </div>
                  <div className="flex-1">
                    <NextButton onClick={handleNext} disabled={!currentAnswer} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar Ad */}
          <div className="hidden xl:flex items-center justify-center sticky top-8">
            <AdSlot variant="vertical-cards" />
          </div>
        </div>
      </div>

      <Footer />
      <AdContainer heightClass="h-[266px]" widthClass="w-full max-w-none" className="rounded-tl-[4px] rounded-tr-[4px] m-0">
        <AdSlot slotId="YA_QHOME_FEED_003" />
      </AdContainer>
    </div>
  );
};

export default QuizContainer;