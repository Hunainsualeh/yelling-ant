import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/ui/Sidebar';
import QuizContainer from '../quiz/components/QuizContainer';
import api from '../utils/api';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { SuccessModal } from '../components/ui/SuccessModal';
import { Alert, AlertTitle, AlertDescription } from '../components/ui/alert';
import Loader from '../components/ui/Loader';

const PreviewQuiz: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState<any | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      } catch (err: any) {
        console.error('Failed to load preview', err);
        setError('Failed to load preview. Ensure you are logged in as admin.');
        // give user a moment to see the error, then navigate back
        setTimeout(() => navigate('/admin/quizzes'), 1600);
      }
    })();
  }, [slug, navigate]);

  const performPublish = async () => {
    if (!slug) return;

    setIsPublishing(true);
    setError(null);
    try {
      let token = localStorage.getItem('admin_token');
      if (!token && import.meta.env.DEV) {
        token = 'ayW1YVN3g72H';
      }

      await api.publishQuiz(slug, true, token || undefined);
      setShowSuccess(true);
    } catch (err: any) {
      console.error('Publish failed', err);
      setError('Failed to publish quiz: ' + (err.message || err));
    } finally {
      setIsPublishing(false);
      setShowConfirm(false);
    }
  };



if (!quizData) return <div className="min-h-screen flex"><Sidebar variant="admin" /><main className="flex-1 p-8 flex items-center justify-center"><Loader message="Loading preview…" /></main></div>;

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
              onClick={() => setShowConfirm(true)}
              disabled={isPublishing}
              className="px-6 py-2 bg-[#C85103] text-white rounded-lg hover:bg-[#A04102] font-medium disabled:opacity-50"
            >
              {isPublishing ? 'Publishing...' : 'Publish Now'}
            </button>
          </div>
        </div>
        {error && (
          <div className="mt-4">
            <Alert className="bg-red-50 border-red-200">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}
        <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <QuizContainer quizData={quizData} isPreview={true} />
        </div>

        <ConfirmDialog
          open={showConfirm}
          onOpenChange={setShowConfirm}
          onConfirm={performPublish}
          title="Publish quiz?"
          description="Are you sure you want to publish this quiz? It will be visible to all users."
          confirmText="Publish"
          type="warning"
        />

        <SuccessModal
          isOpen={showSuccess}
          onClose={() => { setShowSuccess(false); navigate('/admin/quizzes'); }}
          title="Quiz published"
          message="The quiz is now live and visible to all users."
          actionLabel="Go to quizzes"
        />
      </main>
    </div>
  );
};

export default PreviewQuiz;
