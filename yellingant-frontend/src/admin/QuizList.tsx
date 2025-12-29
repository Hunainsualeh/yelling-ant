import React, { useEffect, useState } from 'react';
import { Sidebar } from '../components';
import api from '../utils/api';

const QuizList: React.FC = () => {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch((import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000') + '/api/admin/quiz', {
          headers: { Authorization: `Bearer ${localStorage.getItem('admin_token') || ''}` },
        });
        const data = await res.json();
        setQuizzes(data.quizzes || []);
      } catch (e) {
        console.error('Failed to load quizzes', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar variant="admin" />
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-semibold mb-4">All Quizzes</h1>
        {loading ? (
          <div>Loading…</div>
        ) : (
          <div className="grid gap-3">
            {quizzes.map((q) => (
              <div key={q.id} className="p-4 bg-white rounded shadow-sm flex items-center justify-between">
                <div>
                  <div className="font-medium">{q.title}</div>
                  <div className="text-sm text-gray-500">slug: {q.slug} — status: {q.status}</div>
                </div>
                  <div className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                    <a href={`/quiz/${q.slug}`} className="text-indigo-600 hover:text-indigo-900">View</a>
                    {q.status === 'draft' && (
                      <a href={`/admin/preview/${q.slug}`} className="text-gray-700 hover:text-gray-900">Preview</a>
                    )}
                  </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default QuizList;
