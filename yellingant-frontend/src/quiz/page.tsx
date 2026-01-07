import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import QuizTypeImageOptions from './components/QuizTypeImageOptions';
import QuizContainer from './components/QuizContainer';
import type { QuizData } from './types';
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
