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
import transformQuizData from './utils/transformQuizData';
import Loader from '../components/ui/Loader';

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
            // api.getQuiz returns the quiz object - transform it to frontend format
            const rawQuiz = res.quiz || res;
            const transformed = transformQuizData(rawQuiz);
            setQuizData(transformed);
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
            <Loader message="Loading quiz..." />
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
};

export default QuizPage;
