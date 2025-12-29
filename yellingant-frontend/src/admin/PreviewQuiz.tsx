import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/ui/Sidebar';
import api from '../utils/api';
import QuizContainer from '../quiz/components/QuizContainer';

const PreviewQuiz: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState<any | null>(null);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        const res = await fetch((import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000') + `/api/admin/quiz/${encodeURIComponent(slug)}/preview`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('admin_token') || ''}` },
        });
        if (!res.ok) throw new Error('Preview fetch failed');
        const data = await res.json();
        setQuizData(data.quiz || data);
      } catch (err) {
        console.error('Failed to load preview', err);
        alert('Failed to load preview. Ensure you are logged in as admin.');
        navigate('/admin/quizzes');
      }
    })();
  }, [slug, navigate]);

  if (!quizData) return <div className="min-h-screen flex"><Sidebar variant="admin" /><main className="flex-1 p-8">Loading preview…</main></div>;

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex">
      <Sidebar variant="admin" />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-semibold mb-4">Preview: {quizData.title}</h1>
        <QuizContainer quizData={quizData} />
      </main>
    </div>
  );
};

export default PreviewQuiz;
