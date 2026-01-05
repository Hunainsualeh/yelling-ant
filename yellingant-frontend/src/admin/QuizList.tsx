import React, { useEffect, useState } from 'react';
import { Sidebar } from '../components';
import { getAllQuizzes, deleteQuiz, publishQuiz } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ui/toast';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Edit, Trash2, Eye, EyeOff, FileText, Plus } from 'lucide-react';

interface Quiz {
  id: string;
  title: string;
  slug: string;
  status: string;
  description?: string;
  created_at?: string;
}

const QuizList: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [, setActionLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  
  const navigate = useNavigate();
  const { showToast } = useToast();

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      const data = await getAllQuizzes();
      setQuizzes(data.quizzes || []);
    } catch (e: any) {
      console.error('Failed to load quizzes', e);
      showToast(e.message || 'Failed to load quizzes', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuizzes();
  }, []);

  const handleDelete = async () => {
    if (!selectedQuiz) return;
    
    try {
      setActionLoading(true);
      await deleteQuiz(selectedQuiz.slug);
      showToast('Quiz deleted successfully', 'success');
      setQuizzes(quizzes.filter(q => q.id !== selectedQuiz.id));
      setSelectedQuiz(null);
    } catch (e: any) {
      console.error('Failed to delete quiz', e);
      showToast(e.message || 'Failed to delete quiz', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleTogglePublish = async () => {
    if (!selectedQuiz) return;
    
    try {
      setActionLoading(true);
      const shouldPublish = selectedQuiz.status === 'draft';
      await publishQuiz(selectedQuiz.slug, shouldPublish);
      
      showToast(
        shouldPublish ? 'Quiz published successfully' : 'Quiz unpublished successfully',
        'success'
      );
      
      // Update the quiz status in the list
      setQuizzes(quizzes.map(q => 
        q.id === selectedQuiz.id 
          ? { ...q, status: shouldPublish ? 'published' : 'draft' }
          : q
      ));
      setSelectedQuiz(null);
    } catch (e: any) {
      console.error('Failed to toggle publish status', e);
      showToast(e.message || 'Failed to update quiz status', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredQuizzes = quizzes.filter(q => {
    if (filterStatus === 'all') return true;
    return q.status === filterStatus;
  });

  const publishedCount = quizzes.filter(q => q.status === 'published').length;
  const draftCount = quizzes.filter(q => q.status === 'draft').length;

  return (
    <div className="h-screen bg-[#FFFFFF] flex overflow-hidden">
      <Sidebar variant="admin" />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[32px] font-gotham font-medium">Quiz Management</h1>
            <p className="text-gray-500 mt-1">
              {publishedCount} published • {draftCount} drafts
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/quiz/new')}
            className="flex items-center gap-2 px-6 py-3 bg-[#C85103] hover:bg-[#a84400] text-white font-helvetica font-medium text-[14px] rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create New Quiz
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              filterStatus === 'all'
                ? 'text-[#C85103] border-b-2 border-[#C85103]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            All Quizzes ({quizzes.length})
          </button>
          <button
            onClick={() => setFilterStatus('published')}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              filterStatus === 'published'
                ? 'text-[#C85103] border-b-2 border-[#C85103]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Published ({publishedCount})
          </button>
          <button
            onClick={() => setFilterStatus('draft')}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              filterStatus === 'draft'
                ? 'text-[#C85103] border-b-2 border-[#C85103]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Drafts ({draftCount})
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading quizzes...</div>
          </div>
        ) : filteredQuizzes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <FileText className="w-12 h-12 mb-2 text-gray-400" />
            <p>No quizzes found</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {filteredQuizzes.map((q) => (
              <div 
                key={q.id} 
                className="p-4 bg-white rounded-lg shadow-sm flex items-center justify-between border border-gray-100 hover:border-gray-200 transition-colors"
              >
                <div className="min-w-0 flex-1 mr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="font-medium truncate" title={q.title}>
                      {q.title}
                    </div>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      q.status === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {q.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    {q.description || `Slug: ${q.slug}`}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                  {/* View Quiz */}
                  <button
                    onClick={() => navigate(`/quiz/${q.slug}`)}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    title="View Quiz"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {/* Edit Quiz */}
                  <button
                    onClick={() => navigate(`/admin/quiz/edit/${q.slug}`)}
                    className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Quiz"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  {/* Toggle Publish Status */}
                  <button
                    onClick={() => {
                      setSelectedQuiz(q);
                      setPublishDialogOpen(true);
                    }}
                    className={`p-2 rounded-lg transition-colors ${
                      q.status === 'published'
                        ? 'text-amber-600 hover:text-amber-900 hover:bg-amber-50'
                        : 'text-green-600 hover:text-green-900 hover:bg-green-50'
                    }`}
                    title={q.status === 'published' ? 'Unpublish Quiz' : 'Publish Quiz'}
                  >
                    {q.status === 'published' ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>

                  {/* Delete Quiz */}
                  <button
                    onClick={() => {
                      setSelectedQuiz(q);
                      setDeleteDialogOpen(true);
                    }}
                    className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Quiz"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Quiz"
        description={`Are you sure you want to delete "${selectedQuiz?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />

      {/* Publish/Unpublish Confirmation Dialog */}
      <ConfirmDialog
        open={publishDialogOpen}
        onOpenChange={setPublishDialogOpen}
        onConfirm={handleTogglePublish}
        title={selectedQuiz?.status === 'published' ? 'Unpublish Quiz' : 'Publish Quiz'}
        description={
          selectedQuiz?.status === 'published'
            ? `Are you sure you want to unpublish "${selectedQuiz?.title}"? It will no longer be visible on the website.`
            : `Are you sure you want to publish "${selectedQuiz?.title}"? It will become visible on the website.`
        }
        confirmText={selectedQuiz?.status === 'published' ? 'Unpublish' : 'Publish'}
        type={selectedQuiz?.status === 'published' ? 'warning' : 'info'}
      />
    </div>
  );
};

export default QuizList;
