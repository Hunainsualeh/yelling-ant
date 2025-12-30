import React, { useEffect, useState } from 'react';
import { Sidebar } from '../components';
import { getAllQuizzes } from '../utils/api';

const QuizList: React.FC = () => {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getAllQuizzes();
        setQuizzes(data.quizzes || []);
      } catch (e) {
        console.error('Failed to load quizzes', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="h-screen bg-[#FFFFFF] flex overflow-hidden">
      <Sidebar variant="admin" />
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-semibold mb-4">All Quizzes</h1>
        {loading ? (
          <div>Loading…</div>
        ) : (
          <div className="grid gap-3">
            {quizzes.map((q) => (
              <div key={q.id} className="p-4 bg-white rounded shadow-sm flex items-center justify-between border border-gray-100">
                <div className="min-w-0 flex-1 mr-4">
                  <div className="font-medium truncate" title={q.title}>{q.title}</div>
                  <div className="text-sm text-gray-500 truncate">slug: {q.slug} — status: {q.status}</div>
                </div>
                  <div className="whitespace-nowrap text-right text-sm font-medium space-x-4 flex-shrink-0">
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
