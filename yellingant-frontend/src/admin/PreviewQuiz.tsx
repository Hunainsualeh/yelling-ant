import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/ui/Sidebar';
import QuizContainer from '../quiz/components/QuizContainer';
import api from '../utils/api';

const PreviewQuiz: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState<any | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        // Use the same token logic as api.ts
        let token = localStorage.getItem('admin_token');
        if (!token && import.meta.env.DEV) {
          token = 'ayW1YVN3g72H';
        }

        const res = await fetch((import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000') + `/api/admin/quiz/${encodeURIComponent(slug)}/preview`, {
          headers: { Authorization: `Bearer ${token || ''}` },
        });
        if (!res.ok) throw new Error('Preview fetch failed');
        const data = await res.json();
        console.log('PreviewQuiz - raw API response:', data);
        console.log('PreviewQuiz - quiz data:', data.quiz || data);
        setQuizData(data.quiz || data);
      } catch (err) {
        console.error('Failed to load preview', err);
        alert('Failed to load preview. Ensure you are logged in as admin.');
        navigate('/admin/quizzes');
      }
    })();
  }, [slug, navigate]);

  const handlePublish = async () => {
    if (!slug) return;
    if (!window.confirm('Are you sure you want to publish this quiz? It will be visible to all users.')) return;
    
    setIsPublishing(true);
    try {
      let token = localStorage.getItem('admin_token');
      if (!token && import.meta.env.DEV) {
        token = 'ayW1YVN3g72H';
      }
      
      await api.publishQuiz(slug, true, token || undefined);
      alert('Quiz published successfully!');
      navigate('/admin/quizzes');
    } catch (err: any) {
      console.error('Publish failed', err);
      alert('Failed to publish quiz: ' + (err.message || err));
    } finally {
      setIsPublishing(false);
    }
  };

  if (!quizData) return <div className="min-h-screen flex"><Sidebar variant="admin" /><main className="flex-1 p-8">Loading preview…</main></div>;

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex">
      <Sidebar variant="admin" />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Preview: {quizData.title}</h1>
          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/admin/create?slug=${slug}`)}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium"
            >
              Edit
            </button>
            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className="px-6 py-2 bg-[#C85103] text-white rounded-lg hover:bg-[#A04102] font-medium disabled:opacity-50"
            >
              {isPublishing ? 'Publishing...' : 'Publish Now'}
            </button>
          </div>
        </div>
        <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <QuizContainer quizData={quizData} isPreview={true} />
        </div>
      </main>
    </div>
  );
};

export default PreviewQuiz;
