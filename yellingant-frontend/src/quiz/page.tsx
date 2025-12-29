import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QuizQuestion } from './components/QuizQuestion';
import { QuizResult } from './components/QuizResult';
// import QuizTypeImageOptions from './components/QuizTypeImageOptions';
import QuizContainer from './components/QuizContainer';
import RestartSection from '../components/ui/restart';
import { NextButton } from '../components/ui/next';
import ProgressIndicator from '../components/ui/progressindicator';
import type { QuizData, QuizState } from './types';
import { getQuizBySlug } from './data/quizzes';
import api from '../utils/api';
import Header from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import AdSlot from '../components/ui/AdSlot';
import AdContainer from '../components/ui/AdContainer';

const QuizPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    answers: {},
    score: 0,
    result: null,
    isCompleted: false,
    showFeedback: false,
    isCorrect: null,
  });

  useEffect(() => {
    if (slug) {
      // First try to fetch from backend API (published quizzes)
      try {
        (async () => {
          try {
            const res = await api.getQuiz(slug);
            // api.getQuiz returns the quiz object
            setQuizData(res.quiz || res);
            return;
          } catch (err) {
            // fallback to local data if backend not available or quiz not published
            // eslint-disable-next-line no-console
            console.warn('[QuizPage] backend fetch failed, falling back to local getQuizBySlug', err);
            const quiz = getQuizBySlug(slug);
            if (quiz) {
              setQuizData(quiz);
            } else {
              navigate('/');
            }
          }
        })();
      } catch (e) {
        const quiz = getQuizBySlug(slug);
        if (quiz) setQuizData(quiz);
        else navigate('/');
      }
    }
  }, [slug, navigate]);

  const handleAnswerSelect = (answerId: string) => {
    setQuizState((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [prev.currentQuestionIndex]: answerId,
      },
    }));
  };

  const handleNext = () => {
    if (!quizData) return;

    const nextIndex = quizState.currentQuestionIndex + 1;

    if (nextIndex >= quizData.questions.length) {
      // Calculate result
      const result = calculateResult();
      setQuizState((prev) => ({
        ...prev,
        result,
        isCompleted: true,
      }));
    } else {
      setQuizState((prev) => ({
        ...prev,
        currentQuestionIndex: nextIndex,
      }));
    }
  };

  const calculateResult = (): QuizData['results'][0] => {
    if (!quizData) return quizData!.results[0];

    if (quizData.type === 'personality') {
      // Count personality types
      const typeCounts: Record<string, number> = {};
      
      Object.values(quizState.answers).forEach((answerId) => {
        const answer = quizData.questions
          .flatMap((q) => q.options)
          .find((opt) => opt?.id === answerId);
        
        if (answer?.personalityType) {
          typeCounts[answer.personalityType] = 
            (typeCounts[answer.personalityType] || 0) + 1;
        }
      });

      // Find most common type
      const dominantType = Object.entries(typeCounts).sort(
        ([, a], [, b]) => b - a
      )[0]?.[0];

      return (
        quizData.results.find((r) => r.type === dominantType) ||
        quizData.results[0]
      );
    } else if (quizData.type === 'scored' || quizData.type === 'trivia') {
      // Calculate score for trivia
      let correctAnswers = 0;
      Object.entries(quizState.answers).forEach(([qIndex, answerId]) => {
        const question = quizData.questions[parseInt(qIndex)];
        if (question?.correctAnswer === answerId) {
          correctAnswers++;
        }
      });

      const percentScore = Math.round((correctAnswers / quizData.questions.length) * 100);
      
      setQuizState(prev => ({ ...prev, score: percentScore }));

      // Find appropriate result based on score
      const scoreRanges = quizData.results.map((r, i) => ({
        result: r,
        minScore: i * Math.ceil(100 / quizData.results.length),
      }));

      const appropriateResult = scoreRanges.reverse().find(
        ({ minScore }) => percentScore >= minScore
      );

      return appropriateResult?.result || quizData.results[0];
    }

    return quizData.results[0];
  };

  const handleRestart = () => {
    setQuizState({
      currentQuestionIndex: 0,
      answers: {},
      score: 0,
      result: null,
      isCompleted: false,
      showFeedback: false,
      isCorrect: null,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!quizData) {
    return (
      <div className="min-h-screen bg-white flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex items-center justify-center h-[calc(100vh-486px)]">
          <div className="text-center">
            <div className="text-2xl font-semibold text-gray-900 mb-2">
              Loading quiz...
            </div>
          </div>
        </div>
        <Footer />
        <AdContainer heightClass="h-[266px]" widthClass="w-full max-w-none" className="rounded-tl-[4px] rounded-tr-[4px] m-0">
          <AdSlot slotId="YA_QHOME_FEED_003" />
        </AdContainer>
      </div>
    );
  }

  // Use a unified QuizContainer for all quiz types
  return (
    <QuizContainer quizData={quizData} />
  );
  const currentQuestion = quizData?.questions[quizState.currentQuestionIndex];
  const progress = quizData ? ((quizState.currentQuestionIndex + 1) / (quizData?.totalQuestions ?? 1)) * 100 : 0;
  const currentAnswer = quizState.answers[quizState.currentQuestionIndex];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      {/* Main Content with Quiz and AdSlot */}
      <div className="w-full flex flex-row justify-between px-0 py-8 gap-4">
        {/* Quiz Container */}
        <div className="flex-1 max-w-none min-h-[700px] mx-auto mt-16 shadow-lg rounded-[20px] bg-white mr-6" style={{ width: 'min(100%, clamp(320px, 66vw, 900px))' }}>
          {!quizState.isCompleted ? (
            <div className="w-full space-y-8">
              {/* Restart & Progress Section */}
              <RestartSection 
                onRestart={handleRestart}
                progress={progress}
                current={quizState.currentQuestionIndex + 1}
                total={quizData?.totalQuestions ?? 0}
              />

              {/* Top Progress Indicator */}
              <ProgressIndicator 
                value={progress}
                current={quizState.currentQuestionIndex + 1}
              />

              {/* Question */}
              <div className="mt-8">
                <QuizQuestion
                  question={currentQuestion!}
                  selectedAnswer={currentAnswer}
                  onAnswerSelect={handleAnswerSelect}
                />
              </div>

              {/* Next Button */}
              <div className="mt-8">
                <NextButton 
                  onClick={handleNext}
                  disabled={!currentAnswer}
                />
              </div>
            </div>
          ) : (
            <div className="py-12">
              {quizState.result && (
                <QuizResult
                  result={quizState.result!}
                  quizTitle={quizData?.title ?? ''}
                  onRestart={handleRestart}
                  score={quizData && (quizData?.type === 'trivia' || quizData?.type === 'scored') ? quizState.score : undefined}
                />
              )}
            </div>
          )}
        </div>
        {/* Vertical Cards Ad Slot - Top Right */}
        <div className="hidden lg:flex items-start min-h-full pr-0 mr-6">
          <AdSlot variant="vertical-cards" />
        </div>
      </div>
      <Footer />
      <AdContainer heightClass="h-[266px]" widthClass="w-full max-w-none" className="rounded-tl-[4px] rounded-tr-[4px] m-0">
        <AdSlot slotId="YA_QHOME_FEED_003" />
      </AdContainer>
    </div>
  );
};

export default QuizPage;
