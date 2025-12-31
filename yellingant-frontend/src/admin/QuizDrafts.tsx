import React, { useEffect, useState } from 'react';
import { Sidebar } from '../components';
import { getAllQuizzes, publishQuiz, deleteQuiz } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ui/toast';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Edit, Trash2, Eye, FileText, Clock } from 'lucide-react';

interface Quiz {
  id: string;
  title: string;
  slug: string;
  status: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

const QuizDrafts: React.FC = () => {
  const [drafts, setDrafts] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [, setActionLoading] = useState(false);
  
  const navigate = useNavigate();
  const { showToast } = useToast();

  const loadDrafts = async () => {
    try {
      setLoading(true);
      const data = await getAllQuizzes();
      // Filter only draft quizzes
      const draftQuizzes = (data.quizzes || []).filter((q: Quiz) => q.status === 'draft');
      setDrafts(draftQuizzes);
    } catch (e: any) {
      console.error('Failed to load drafts', e);
      showToast(e.message || 'Failed to load drafts', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDrafts();
  }, []);

  const handleDelete = async () => {
    if (!selectedQuiz) return;
    
    try {
      setActionLoading(true);
      await deleteQuiz(selectedQuiz.slug);
      showToast('Draft deleted successfully', 'success');
      setDrafts(drafts.filter(q => q.id !== selectedQuiz.id));
      setSelectedQuiz(null);
    } catch (e: any) {
      console.error('Failed to delete draft', e);
      showToast(e.message || 'Failed to delete draft', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!selectedQuiz) return;
    
    try {
      setActionLoading(true);
      await publishQuiz(selectedQuiz.slug, true);
      showToast('Quiz published successfully', 'success');
      setDrafts(drafts.filter(q => q.id !== selectedQuiz.id));
      setSelectedQuiz(null);
    } catch (e: any) {
      console.error('Failed to publish quiz', e);
      showToast(e.message || 'Failed to publish quiz', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="h-screen bg-[#FFFFFF] flex overflow-hidden">
      <Sidebar variant="admin" />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[32px] font-gotham font-medium">Quiz Drafts</h1>
            <p className="text-gray-500 mt-1">
              {drafts.length} unpublished {drafts.length === 1 ? 'quiz' : 'quizzes'}
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/quiz/new')}
            className="flex items-center gap-2 px-6 py-3 bg-[#C85103] hover:bg-[#a84400] text-white font-helvetica font-medium text-[14px] rounded-lg transition-colors"
          >
            <FileText className="w-5 h-5" />
            Create New Draft
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading drafts...</div>
          </div>
        ) : drafts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg border border-gray-200">
            <FileText className="w-16 h-16 mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No drafts yet</h3>
            <p className="text-gray-500 text-center max-w-md mb-6">
              Create a new quiz and save it as a draft to work on it later before publishing.
            </p>
            <button
              onClick={() => navigate('/admin/quiz/new')}
              className="px-6 py-3 bg-[#C85103] hover:bg-[#a84400] text-white font-medium rounded-lg transition-colors"
            >
              Create Your First Draft
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {drafts.map((quiz) => (
              <div 
                key={quiz.id} 
                className="p-5 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 mr-4">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate" title={quiz.title}>
                        {quiz.title}
                      </h3>
                      <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-800 rounded-full shrink-0">
                        Draft
                      </span>
                    </div>
                    
                    {quiz.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {quiz.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>Created: {formatDate(quiz.created_at)}</span>
                      </div>
                      {quiz.updated_at && quiz.updated_at !== quiz.created_at && (
                        <div className="flex items-center gap-1">
                          <span>Updated: {formatDate(quiz.updated_at)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Preview */}
                    <button
                      onClick={() => navigate(`/admin/preview/${quiz.slug}`)}
                      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Preview Draft"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => navigate(`/admin/quiz/edit/${quiz.slug}`)}
                      className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Edit className="w-4 h-4" />
                        Edit
                      </div>
                    </button>

                    {/* Publish */}
                    <button
                      onClick={() => {
                        setSelectedQuiz(quiz);
                        setPublishDialogOpen(true);
                      }}
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                    >
                      Publish
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => {
                        setSelectedQuiz(quiz);
                        setDeleteDialogOpen(true);
                      }}
                      className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Draft"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
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
        title="Delete Draft"
        description={`Are you sure you want to delete the draft "${selectedQuiz?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />

      {/* Publish Confirmation Dialog */}
      <ConfirmDialog
        open={publishDialogOpen}
        onOpenChange={setPublishDialogOpen}
        onConfirm={handlePublish}
        title="Publish Quiz"
        description={`Are you sure you want to publish "${selectedQuiz?.title}"? It will become visible on the website.`}
        confirmText="Publish"
        type="info"
      />
    </div>
  );
};

export default QuizDrafts;
