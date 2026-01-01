import React, { useState } from 'react';
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
  isPreview?: boolean;
};

type QuizState = {
  currentQuestionIndex: number;
  answers: Record<number, string | string[]>;
  score: number;
  result: any;
  isCompleted: boolean;
};

const QuizContainer: React.FC<QuizContainerProps> = ({ quizData: rawQuizData, isPreview = false }) => {
  // Normalize quiz data to ensure all fields are present
  const quizData: QuizData = {
    ...rawQuizData,
    // Ensure description exists
    description: rawQuizData.description || rawQuizData.dek || '',
    // Ensure heroImage exists
    heroImage: rawQuizData.heroImage || rawQuizData.hero_image || '',
    // Ensure totalQuestions is set
    totalQuestions: rawQuizData.totalQuestions || rawQuizData.questions?.length || 0,
    // Normalize questions to ensure they have required fields
    questions: (rawQuizData.questions || []).map((q: any, idx: number) => ({
      ...q,
      id: q.id ?? idx + 1,
      question: q.question || q.text || '',
      text: q.text || q.question || '',
      type: q.type || 'single',
      options: (q.options || []).map((o: any) => ({
        ...o,
        label: o.label || o.text || '',
      })),
    })),
    // Ensure results is an array
    results: Array.isArray(rawQuizData.results) 
      ? rawQuizData.results 
      : Object.values(rawQuizData.results || {}).length > 0
        ? Object.values(rawQuizData.results)
        : [{ id: 'r1', type: 'default', title: 'Complete!', description: 'You finished the quiz.', image: '' }],
  };

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

      // Update state to show result component in-place instead of navigating
      setQuizState((prev) => ({
        ...prev,
        result,
        score: percentScore,
        isCompleted: true,
      }));
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
  
  // Map question types from backend to frontend types
  // Backend/Admin uses: single, multiple, image-options, image-choice, text-input, slider, figma-image, personality
  // Frontend components: QuizQuestion (single/multiple), QuizTypeImageOptions, QuizTypeTextInput, QuizTypeSlider, QuizTypeFigmaQuestion, Personality
  const getQuestionType = (question: any): string => {
    if (!question) return 'single';
    // Use explicit question type if provided
    if (question.type) return question.type;
    // Check if options have images - use image-options
    if (question.options?.some((o: any) => o.image)) return 'image-options';
    // Default to single
    return 'single';
  };
  
  const questionType = getQuestionType(currentQuestion);
  
  // For image-choice type (This/That style), use image-options component
  const normalizedQuestionType = questionType === 'image-choice' ? 'image-options' : questionType;
  
  // Debug: log quiz & question types so we can confirm which component branch runs
  // eslint-disable-next-line no-console
  console.log('QuizContainer debug ->', { slug: quizData.slug, quizType: quizData.type, questionType: normalizedQuestionType, currentQuestion });
  const currentAnswer = quizState.answers[quizState.currentQuestionIndex];

  if (quizState.isCompleted) {
    // If we are in a preview context (e.g. inside admin dashboard), we might want to avoid full page layout
    // But QuizResult is designed as a full page.
    // We can render it directly.
    const resultWithSummaries = quizState.result as any;
    return (
      <QuizResult 
        result={quizState.result} 
        quizTitle={quizData.title} 
        onRestart={handleRestart} 
        score={quizState.score}
        quizType={quizData.type}
        answerSummaries={resultWithSummaries?.answerSummaries}
        showAnswerSummary={quizData.type === 'trivia' || quizData.type === 'scored'}
      />
    );
  }

  const totalQuestions = quizData.questions.length;
  const questionNumber = quizState.currentQuestionIndex + 1;
  const isMinimalFigmaQuiz = quizData.slug !== 'order-a-feast-figma' && quizData.questions.every((q) => q.type === 'figma-image');

  if (isMinimalFigmaQuiz) {
    return (
      <div className="min-h-screen bg-white flex flex-col overflow-x-hidden">
        <div className="w-full flex justify-center px-2 sm:px-0">
          <div className="w-full max-w-none">
            <QuizCategories />
          </div>
        </div>
        
        <div className="w-full px-2 sm:px-4 py-4 sm:py-8">
          <div className="w-full max-w-[1440px] mx-auto grid grid-cols-1 xl:grid-cols-[auto_minmax(300px,846px)_auto] gap-2 sm:gap-4 items-start">
            {/* Left Ad (desktop only) */}
            <div className="hidden xl:flex items-start justify-center sticky top-8">
              <AdSlot variant="vertical-cards" position="left" />
            </div>
            
            {/* Main Quiz Card */}
            <div className="flex justify-center w-full">
              <div className="w-full max-w-[846px] rounded-2xl border border-[#E5E5E5] bg-white shadow-sm p-3 sm:p-6 font-sans flex flex-col gap-4 sm:gap-6">
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
                  <div className="relative w-full h-5 sm:h-6 rounded-full bg-gray-100 overflow-hidden">
                    <div 
                      className="absolute left-0 top-0 h-full rounded-full transition-all duration-300 ease-out bg-[#7C3AED]" 
                      style={{ width: `${(questionNumber / totalQuestions) * 100}%` }} 
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs sm:text-sm font-medium text-[#7C3AED]">{questionNumber} of {totalQuestions}</span>
                    </div>
                  </div>
                </div>
                
                {/* Question Content */}
                <div className="w-full flex flex-col gap-4 sm:gap-6">
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
                  ) : quizData.type === 'image-options' || normalizedQuestionType === 'image-options' ? (
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
                  ) : normalizedQuestionType === 'text-input' ? (
                    <QuizTypeTextInput
                      question={currentQuestion}
                      selectedAnswer={currentAnswer as string}
                      onAnswerSelect={(val: string) => handleAnswerSelect(val)}
                    />
                  ) : normalizedQuestionType === 'figma-image' ? (
                    <QuizTypeFigmaQuestion
                      question={currentQuestion}
                      selectedAnswer={currentAnswer as string}
                      onAnswerSelect={(val: string) => handleAnswerSelect(val)}
                    />
                  ) : normalizedQuestionType === 'slider' ? (
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
                
                {/* Ad Slot - Quiz Banner */}
                <div className="w-full flex justify-center">
                  <AdSlot slotId="quiz-main" variant="quiz-banner" />
                </div>
                
                {/* Bottom Action Buttons */}
                {quizData.type !== 'image-options' && (
                  <div className="flex flex-col sm:flex-row gap-3 w-full items-center justify-center">
                    <div className="w-full sm:w-auto sm:flex-1 sm:max-w-[250px]">
                      <JoinYellingAntButton onClick={() => window.open('https://yellingant.com', '_blank')} />
                    </div>
                    <div className="w-full sm:w-auto sm:flex-1 sm:max-w-[395px]">
                      <NextButton onClick={handleNext} disabled={!currentAnswer} />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Right Ad (desktop only) */}
            <div className="hidden xl:flex items-start justify-center sticky top-8">
              <AdSlot variant="vertical-cards" position="right" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white flex flex-col overflow-x-hidden">
      {!isPreview && <Header />}
      {!isPreview && <Navbar />}
      {!isPreview && <QuizCategories selectedCategory="" onSelectCategory={() => {}} />}
      
      {/* Main Quiz Container with Sidebar Ads */}
      <div className="w-full py-4 sm:py-8 px-2 sm:px-4">
        <div className={`w-full max-w-[1440px] mx-auto grid ${isPreview ? 'grid-cols-1 justify-items-center' : 'grid-cols-1 xl:grid-cols-[auto_minmax(300px,846px)_auto]'} gap-2 sm:gap-4 items-start`}>
          {/* Left Sidebar Ad */}
          {!isPreview && (
          <div className="hidden xl:flex items-start justify-center sticky top-8">
            <AdSlot variant="vertical-cards" position="left" />
          </div>
          )}

          {/* Main Quiz Card */}
          <div className="flex justify-center w-full">
            <div className="w-full max-w-[846px] rounded-2xl border border-[#E5E5E5] bg-white shadow-sm p-3 sm:p-6 font-sans">
              <div className="flex flex-col gap-4 sm:gap-6">
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
                  <div className="relative w-full h-5 sm:h-6 rounded-full bg-gray-100 overflow-hidden">
                    <div 
                      className="absolute left-0 top-0 h-full rounded-full transition-all duration-300 ease-out bg-[#7C3AED]" 
                      style={{ width: `${(questionNumber / totalQuestions) * 100}%` }} 
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs sm:text-sm font-medium text-[#7C3AED]">
                        {questionNumber} of {totalQuestions}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Question Content Area */}
                <div className="flex flex-col items-center gap-4 sm:gap-6 w-full">
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
                  ) : questionType === 'image-options' || quizData.type === 'image-options' || normalizedQuestionType === 'image-options' ? (
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
                  ) : normalizedQuestionType === 'text-input' ? (
                    <QuizTypeTextInput
                      question={currentQuestion}
                      selectedAnswer={currentAnswer as string}
                      onAnswerSelect={(val: string) => handleAnswerSelect(val)}
                    />
                  ) : normalizedQuestionType === 'figma-image' ? (
                    <QuizTypeFigmaQuestion
                      question={currentQuestion}
                      selectedAnswer={currentAnswer as string}
                      onAnswerSelect={(val: string) => handleAnswerSelect(val)}
                    />
                  ) : normalizedQuestionType === 'slider' ? (
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

                {/* Ad Slot - Quiz Banner */}
                <div className="w-full flex justify-center">
                  <AdSlot slotId="quiz-main" variant="quiz-banner" />
                </div>

                {/* Bottom Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 w-full items-center justify-center">
                  <div className="w-full sm:w-auto sm:flex-1 sm:max-w-[250px]">
                    <JoinYellingAntButton onClick={() => window.open('https://yellingant.com', '_blank')} />
                  </div>
                  <div className="w-full sm:w-auto sm:flex-1 sm:max-w-[395px]">
                    <NextButton onClick={handleNext} disabled={!currentAnswer} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar Ad */}
          {!isPreview && (
          <div className="hidden xl:flex items-start justify-center sticky top-8">
            <AdSlot variant="vertical-cards" position="right" />
          </div>
          )}
        </div>
      </div>

      {!isPreview && <Footer />}
      {!isPreview && (
      <AdContainer heightClass="h-[266px]" widthClass="w-full max-w-none" className="rounded-tl-[4px] rounded-tr-[4px] m-0">
        <AdSlot slotId="YA_QHOME_FEED_003" />
      </AdContainer>
      )}
    </div>
  );
};

export default QuizContainer;