import React, { useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { QuizResult as QuizResultComponent } from './components/QuizResult';

const QuizResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();

  // Expect location.state to have: { result, quizTitle, score }
  const state = location.state as { result?: any; quizTitle?: string; score?: number } | null;

  const onRestart = () => {
    // restart the same quiz: navigate back to quiz start
    if (slug) navigate(`/quiz/${slug}`);
    else navigate('/');
  };

  // Redirect if no result in state
  useEffect(() => {
    if (!state || !state.result) {
      navigate('/');
    }
  }, [state, navigate]);

  if (!state || !state.result) {
    // Show loading/nothing while redirecting
    return null;
  }

  return <QuizResultComponent result={state.result} quizTitle={state.quizTitle || ''} onRestart={onRestart} score={state.score} />;
};

export default QuizResultPage;
