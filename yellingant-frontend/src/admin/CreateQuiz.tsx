import React, { useState } from 'react';
import { Sidebar } from '../components';
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useToast } from '../components/ui/toast';

type Option = { id: string; text: string; correct: boolean; image?: string };
type Question = { id: number; text: string; type: string; points: number; options: Option[]; media?: string[] };

const CreateQuiz: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [quizDetails, setQuizDetails] = useState({
    title: 'Introduction to Environmental Science',
    description: 'Test your knowledge about environmental science basics, including renewable energy, ecosystems, and sustainability.',
    category: 'Personality',
    scoring: 'Medium',
  });

  const [settings, setSettings] = useState({
    timeLimit: 15,
    passingScore: 70,
    randomize: true,
    immediateResults: true,
  });
  
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      text: 'What of the following is NOT a renewable energy source?',
      type: 'image-options',
      points: 10,
      options: [
        { id: 'a', text: 'Solar Power', correct: false },
        { id: 'b', text: 'Wind Power', correct: false },
        { id: 'c', text: 'Natural Gas', correct: true },
        { id: 'd', text: 'Hydroelectric Power', correct: false },
      ],
      media: [],
    },
  ]);

  const updateQuestion = (id: number, patch: Partial<Question>) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...patch } : q)));
  };

  // store actual File objects for upload (keyed by string keys: `q_{id}` or `opt_{qid}_{oid}`)
  const [mediaFiles, setMediaFiles] = useState<Record<string, File[]>>({});
  const [mediaAltTexts, setMediaAltTexts] = useState<Record<string, string[]>>({});
  const [createdSlug, setCreatedSlug] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [adminTokenInput, setAdminTokenInput] = useState<string | null>(localStorage.getItem('admin_token'));
  const [errors, setErrors] = useState<Record<string, string>>({});

  const changeQuestionType = (id: number, type: string) => updateQuestion(id, { type });

  const addQuestion = () => {
    setQuestions((prev) => {
      const nextId = prev.length ? Math.max(...prev.map((p) => p.id)) + 1 : 1;
      const next = { id: nextId, text: `Question ${nextId}`, type: 'image-options', points: 10, options: [], media: [] };
      const updated = [...prev, next];
      // set the newly added question as active by index (position), not numeric id
      setCurrentStep(updated.length);
      return updated;
    });
  };

  const deleteQuestion = (id: number) => {
    setQuestions((prev) => {
      const filtered = prev.filter((q) => q.id !== id);
      // keep currentStep within bounds
      setCurrentStep((cs) => Math.max(1, Math.min(cs, filtered.length)));
      return filtered;
    });
  };

  const addOption = (qid: number) => {
    setQuestions((prev) => prev.map((q) => (q.id === qid ? { ...q, options: [...q.options, { id: `${Date.now()}`, text: 'New option', correct: false }] } : q)));
  };

  const removeOption = (qid: number, oid: string) => setQuestions((prev) => prev.map((q) => (q.id === qid ? { ...q, options: q.options.filter((o) => o.id !== oid) } : q)));

  const toggleCorrect = (qid: number, oid: string) => setQuestions((prev) => prev.map((q) => (q.id === qid ? { ...q, options: q.options.map((o) => ({ ...o, correct: o.id === oid })) } : q)));

  const handleMediaUpload = (qid: number, files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    const urls = arr.map((f) => URL.createObjectURL(f));
    setQuestions((prev) => prev.map((q) => (q.id === qid ? { ...q, media: [...(q.media || []), ...urls] } : q)));
    const key = `q_${qid}`;
    setMediaFiles((prev) => ({ ...prev, [key]: [...(prev[key] || []), ...arr] }));
    setMediaAltTexts((prev) => ({ ...prev, [key]: [...(prev[key] || []), ...arr.map((f) => f.name || '')] }));
    setErrors((prev) => {
      const np = { ...prev };
      delete np[key];
      return np;
    });
  };

  const handleOptionImage = (qid: number, oid: string, file?: File) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setQuestions((prev) => prev.map((q) => (q.id === qid ? { ...q, options: q.options.map((o) => (o.id === oid ? { ...o, image: url } : o)) } : q)));
    const key = `opt_${qid}_${oid}`;
    setMediaFiles((prev) => ({ ...prev, [key]: [...(prev[key] || []), file] }));
    setMediaAltTexts((prev) => ({ ...prev, [key]: [...(prev[key] || []), file.name || ''] }));
    setErrors((prev) => {
      const np = { ...prev };
      delete np[key];
      return np;
    });
  };

  const uploadFromUrl = (qid: number, url: string) => {
    if (!url) return;
    setQuestions((prev) => prev.map((q) => (q.id === qid ? { ...q, media: [...(q.media || []), url] } : q)));
  };

  const saveDraft = async () => {
    setIsSaving(true);
    try {
      // assemble payload to satisfy backend validation (requires `type`, `dek`, `results`, and string ids)
      const quizPayload: any = {
        title: quizDetails.title,
        dek: quizDetails.description || '',
        type: 'points',
        questions: questions.map((qq) => ({
          id: String(qq.id),
          text: qq.text || '',
          options: (qq.options && qq.options.length)
            ? qq.options.map((oo) => ({ id: String(oo.id), text: oo.text || '', points: (oo as any).points || 0, correct: !!(oo as any).correct }))
            : [
                { id: 'opt1', text: 'Option 1', points: 1 },
                { id: 'opt2', text: 'Option 2', points: 0 },
              ],
        })),
        // minimal default results so server validation passes
        results: {
          r1: { id: 'r1', title: 'Result 1', description: '' },
        },
      };

      // Note: backend validation currently disallows image/media fields on questions/options.
      // Upload files for storage, but do NOT attach `media` or `image` properties to the quiz payload.
      // Keep a local map of uploaded assets in case admin wants to associate them later.
      const uploadedAssets: Record<string, string[]> = {};
      for (const q of questions) {
        const qKey = `q_${q.id}`;
        const files = mediaFiles[qKey];
        if (files && files.length) {
          const alt_texts = mediaAltTexts[qKey] || files.map((f) => f.name || '');
          const uploaded = await api.uploadImages(files, alt_texts, localStorage.getItem('admin_token') || undefined);
          const urls = (uploaded.files || []).map((f: any) => f.cdnUrl || f.url || f.filename);
          uploadedAssets[qKey] = urls;
        }

        // handle option images per option but don't add to payload
        for (const opt of q.options) {
          const optKey = `opt_${q.id}_${opt.id}`;
          const optFiles = mediaFiles[optKey];
          if (optFiles && optFiles.length) {
            const alt_texts = mediaAltTexts[optKey] || optFiles.map((f) => f.name || '');
            const uploaded = await api.uploadImages(optFiles, alt_texts, localStorage.getItem('admin_token') || undefined);
            const url = (uploaded.files && uploaded.files[0]) ? (uploaded.files[0].cdnUrl || uploaded.files[0].url || uploaded.files[0].filename) : null;
            if (url) {
              uploadedAssets[optKey] = [url];
            }
          }
        }
      }

      // prefer update (PUT) to avoid creating duplicate slug entries
      const token = localStorage.getItem('admin_token') || undefined;
      const slugCandidate = (quizDetails.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      let res: any = undefined;
      // If we have a createdSlug (we previously created/updated), update that one explicitly
      if (createdSlug) {
        res = await api.updateQuiz(createdSlug, quizPayload, token);
      } else {
        // Try updating an existing quiz that would have the same slug as the title
        try {
          res = await api.updateQuiz(slugCandidate, quizPayload, token);
          // if update succeeds, use that slug
          if (res) setCreatedSlug(slugCandidate);
        } catch (err: any) {
          // If update failed because quiz not found (404), fall back to creating a new quiz
          if (err.message && err.message.includes('404')) {
            res = await api.createQuiz(quizPayload, token);
            const slug = res?.quiz?.slug || res?.slug || null;
            if (slug) setCreatedSlug(slug);
          } else {
            // Other errors -> rethrow
            throw err;
          }
        }
      }
      console.log('Quiz saved', res);
      showToast('Quiz saved successfully!', 'success');
      return res;
    } catch (err: any) {
      console.error('Save draft error', err);
      showToast('Failed to save draft: ' + (err.message || err), 'error');
      return undefined;
    }
    finally {
      setIsSaving(false);
    }
  };

  const publish = async () => {
    setIsPublishing(true);
    try {
      // If admin hasn't filled out Quiz Details yet, show that step first instead of saving
      if (currentStep <= questions.length) {
        setCurrentStep(questions.length + 1);
        setIsPublishing(false);
        return;
      }

      // Save draft first (we're on the details/settings step)
      const res = await saveDraft();
      if (!res && !createdSlug) throw new Error('Save draft failed; aborting preview');
      const slug = createdSlug || res?.quiz?.slug || res?.slug || (quizDetails.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      // Open the admin preview page for the saved draft so admin can review before publishing
      navigate(`/admin/preview/${encodeURIComponent(slug)}`);
    } catch (err: any) {
      console.error('Preview error', err);
      showToast('Failed to save preview: ' + (err.message || err), 'error');
    } finally {
      setIsPublishing(false);
    }
  };

  const renderStepContent = () => {
    // Show settings/preview only when currentStep is beyond the last question
    if (currentStep > questions.length) {
      return (
        <div className="bg-white rounded-[12px] shadow-sm p-6 lg:p-8">
          <div className="mb-8">
            <h3 className="text-[20px] font-geist font-semibold text-[#2B2B2B] mb-4">Quiz Details</h3>
            <p className='text-[14] font-geist font-normal text-[#696F79]'></p>
            <div className="space-y-4">
              <div>
                <label className="block font-geist text-[14px] font-semibold text-[#2B2B2B] mb-2">Quiz Title</label>
                <input
                  type="text"
                  value={quizDetails.title}
                  onChange={(e) => setQuizDetails({ ...quizDetails, title: e.target.value })}
                  className="w-full px-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-[8px] text-[14px] font-medium text-[#2B2B2B]"
                />
              </div>
              
              <div>
                <label className="block font-geist text-[14px] font-semibold text-[#2B2B2B] mb-2">Description</label>
                <textarea
                  value={quizDetails.description}
                  onChange={(e) => setQuizDetails({ ...quizDetails, description: e.target.value })}
                  className="w-full px-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-[8px] text-[14px] font-medium text-[#2B2B2B] min-h-[100px]"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-geist text-[14px] font-semibold text-[#2B2B2B] mb-2">Category</label>
                  <select
                    value={quizDetails.category}
                    onChange={(e) => setQuizDetails({ ...quizDetails, category: e.target.value })}
                    className="w-full px-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-[8px] text-[14px] font-medium text-[#2B2B2B]"
                  >
                    <option>Personality</option>
                    <option>Love</option>
                    <option>Pop Celebrity</option>
                    <option>Movies</option>
                    <option>Food</option>
                    <option>Aesthetics</option>
                    <option>General Knowledge</option>
                    <option>Entertainment</option>
                    <option>Lifestyle</option>
                    <option>Science</option>
                    <option>Sports</option>
                  </select>
                </div>

                <div>
                  <label className="block font-geist text-[14px] font-semibold text-[#2B2B2B] mb-2">Difficulty Level</label>
                  <select
                    value={quizDetails.scoring}
                    onChange={(e) => setQuizDetails({ ...quizDetails, scoring: e.target.value })}
                    className="w-full px-4 py-3 bg-[#F9FAFB] border border-gray-200 rounded-[8px] text-[14px] font-medium text-[#2B2B2B]"
                  >
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-[18px] font-geist font-semibold text-[#2B2B2B] mb-4">Questions</h3>
            <div className="space-y-3">
              {questions.map((q, idx) => (
                <div
                  key={q.id}
                  className={`px-4 py-3 rounded-[8px] cursor-pointer transition-colors ${
                    idx === 0 ? 'bg-[#6B46C1] text-white' : 'bg-[#F9FAFB] text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <div className="font-medium text-[14px]">Question {q.id}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[20px] font-geist font-semibold text-[#2B2B2B] mb-2">Quiz Settings</h3>
            <p className="text-[14px] font-geist font-normal text-[#696F79] mb-4">Configure how your quiz works</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-[8px]">
                <label className="block text-[14px] font-medium text-[#2B2B2B]">Time Limit</label>
                <div className="mt-2">
                  <div className="relative">
                    <input
                      type="number"
                      value={settings.timeLimit}
                      onChange={(e) => setSettings({ ...settings, timeLimit: Number(e.target.value) || 0 })}
                      className="w-full pr-14 px-3 py-2 bg-[#F9FAFB] border border-gray-200 rounded-[8px] text-[14px] font-medium text-[#2B2B2B]"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[14px] text-[#2B2B2B]">minutes</span>
                  </div>
                </div>
                <p className="text-[13px] text-[#696F79] mt-2">Set time limit for quiz</p>
              </div>

              <div className="p-4 rounded-[8px]">
                <label className="block text-[14px] font-medium text-[#2B2B2B]">Passing Score</label>
                <div className="mt-2">
                  <div className="relative">
                    <input
                      type="number"
                      value={settings.passingScore}
                      onChange={(e) => setSettings({ ...settings, passingScore: Number(e.target.value) || 0 })}
                      className="w-full pr-10 px-3 py-2 bg-[#F9FAFB] border border-gray-200 rounded-[8px] text-[14px] font-medium text-[#2B2B2B]"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[14px] text-[#2B2B2B]">%</span>
                  </div>
                </div>
                <p className="text-[13px] text-[#696F79] mt-2">Minimum score required to pass</p>
              </div>

              <div className="p-4 rounded-[8px] flex items-center justify-between">
                <div>
                  <div className="text-[14px] font-medium text-[#2B2B2B]">Randomize Questions</div>
                  <div className="text-[13px] text-[#696F79]">Show questions in random order</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.randomize}
                    onChange={(e) => setSettings({ ...settings, randomize: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C85103]"></div>
                </label>
              </div>

              <div className="p-4 rounded-[8px] flex items-center justify-between">
                <div>
                  <div className="text-[14px] font-medium text-[#2B2B2B]">Immediate Results</div>
                  <div className="text-[13px] text-[#696F79]">Show results for each question</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.immediateResults}
                    onChange={(e) => setSettings({ ...settings, immediateResults: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C85103]"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const currentQuestion = questions[currentStep - 1];
    if (!currentQuestion) return null;

    return (
      <div className="bg-white rounded-[12px] shadow-sm p-6 lg:p-8">
        <div className="mb-6">
          <h2 className="text-[20px] font-helvetica font-bold text-gray-900 mb-2">Quiz Questions</h2>
          <p className="text-[14px] font-helvetica font-normal text-[#696F79]">Create and manage your quiz questions</p>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
              <label className="text-[16px] font-medium text-black">Question {currentQuestion.id}</label>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-[14px] font-helvetica text-[#2B2B2B]">Points:</span>
                <input
                  type="number"
                  value={currentQuestion.points}
                  onChange={(e) => updateQuestion(currentQuestion.id, { points: Number(e.target.value) || 0 })}
                  className="w-full sm:w-20 px-3 py-2 bg-[#F9FAFB] border border-gray-200 rounded-[8px] text-[14px]"
                />
                <button
                  onClick={() => deleteQuestion(currentQuestion.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-[14px] font-helvetica font-normal text-[#2B2B2B] mb-2">Question Text</label>
              <textarea
                value={currentQuestion.text}
                onChange={(e) => updateQuestion(currentQuestion.id, { text: e.target.value })}
                className="w-full px-4 py-3 bg-[#F9FAFB] font-helvetica font-normal border border-gray-200 rounded-[8px] text-[14px] min-h-[80px]"
                placeholder="Type your question here"
              />
            </div>

            <div className="mb-6">
              <label className="block text-[14px] font-helvetica font-normal text-[#2B2B2B] mb-2">Question Type</label>
              <select
                value={currentQuestion.type}
                onChange={(e) => changeQuestionType(currentQuestion.id, e.target.value)}
                className="w-full px-4 py-3 bg-[#F9FAFB] font-helvetica font-normal text-[#2B2B2B] border border-gray-200 rounded-[8px] text-[14px]"
              >
                <option value="image-options">Text + Image Answers (image-options)</option>
                <option value="image-choice">Image Choice (image-choice)</option>
                <option value="single">Single Choice (single)</option>
                <option value="multiple">Multiple Choice (multiple)</option>
                <option value="personality">Personality (personality)</option>
                <option value="text-input">Text Only (text-input)</option>
                <option value="slider">Slider (slider)</option>
                <option value="figma-image">Figma Image (figma-image)</option>
              </select>
            </div>

            {currentQuestion.type.toLowerCase().includes('image') && (
              <div className="mb-6">
                <label className="block text-[16px] font-helvetica font-bold text-[#2B2B2B] mb-3">Media Upload</label>
                <p className='font-helvetica text-[14px] text-[#696F79] mb-3'>Add your documents here, and you can upload up to 5 files max</p>
                <div
                  className="border-2 border-dashed border-[#C85103] rounded-[12px] p-8 text-center bg-white hover:bg-orange-50 transition-colors"
                  onDrop={(e) => {
                    e.preventDefault();
                    handleMediaUpload(currentQuestion.id, e.dataTransfer.files);
                  }}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 16l-4-4-4 4" stroke="#C85103" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 3v13" stroke="#C85103" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div>
                      <span className="text-[14px] font-helvetica font-normal text-gray-700">Drag your file(s) or </span>
                      <label htmlFor={`file-${currentQuestion.id}`} className="text-[14px] font-helvetica font-medium text-[#C85103] underline cursor-pointer">
                        browse
                      </label>
                      <input
                        id={`file-${currentQuestion.id}`}
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) => handleMediaUpload(currentQuestion.id, e.target.files)}
                      />
                    </div>
                    <div className="text-[12px] font-helvetica font-normal text-[#696F79]">Max 10 MB files are allowed</div>
                  </div>
                </div>
                <div className="mt-2 text-[14px] font-helvetica font-normal text-[#696F79]">Only support .jpg, .png and .svg files</div>

                {currentQuestion.media && currentQuestion.media.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {currentQuestion.media.map((m, idx) => (
                      <div key={idx} className="relative group">
                        <img src={m} alt={`media-${idx}`} className="w-full h-24 object-cover rounded-[8px] border border-gray-200" />
                        <button
                          onClick={() => {
                            const newMedia = currentQuestion.media?.filter((_, i) => i !== idx);
                            updateQuestion(currentQuestion.id, { media: newMedia });
                          }}
                          className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        >
                          ×
                        </button>
                        <div className="mt-2">
                          <input
                            type="text"
                            placeholder="Alt text (optional)"
                            value={(mediaAltTexts[`q_${currentQuestion.id}`] && mediaAltTexts[`q_${currentQuestion.id}`][idx]) || ''}
                            onChange={(e) => {
                              const key = `q_${currentQuestion.id}`;
                              setMediaAltTexts((prev) => {
                                const arr = [...(prev[key] || [])];
                                arr[idx] = e.target.value;
                                return { ...prev, [key]: arr };
                              });
                            }}
                            className="w-full mt-1 px-2 py-1 text-sm border border-gray-200 rounded-[6px]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {errors[currentQuestion.id] && (
                  <div className="text-red-600 text-sm mt-2">{errors[currentQuestion.id]}</div>
                )}
                <div className="flex items-center my-4">
                  <hr className="flex-1 border-t border-gray-200" />
                  <span className="mx-4 text-[13px] font-helvetica text-[#9CA3AF]">OR</span>
                  <hr className="flex-1 border-t border-gray-200" />
                </div>

                <div className="mt-4">
                  <label className="block text-[16px] font-helvetica font-bold text-[#2B2B2B] mb-2">Upload from URL</label>
                  <div className="relative">
                    <input
                      id={`url-${currentQuestion.id}`}
                      className="w-full pr-28 px-4 py-2 bg-[#F9FAFB] font-helvetica font-normal text-[#696F79] border border-gray-200 rounded-[8px] text-[14px]"
                      placeholder="https://sharefile.xyz/file.jpg"
                    />
                    <button
                      onClick={() => {
                        const el = document.getElementById(`url-${currentQuestion.id}`) as HTMLInputElement | null;
                        if (el && el.value) {
                          uploadFromUrl(currentQuestion.id, el.value);
                          el.value = '';
                        }
                      }}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-gray-200 text-gray-700 rounded-[6px] text-[14px] font-medium hover:bg-gray-300 transition-colors"
                    >
                      Upload
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-[14px] font-helvetica font-medium text-[#2B2B2B] mb-3">Answer Options</label>
              <div className="space-y-3">
                {currentQuestion.options.map((opt) => (
                  <div
                    key={opt.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-[#F9FAFB] rounded-[8px] border border-gray-200"
                  >
                    <input
                      type="radio"
                      name={`q-${currentQuestion.id}`}
                      checked={opt.correct}
                      onChange={() => toggleCorrect(currentQuestion.id, opt.id)}
                      className="w-5 h-5 text-[#2B2B2B] focus:ring-[#7C3AED] flex-shrink-0"
                    />

                    <div className="flex items-center gap-3 flex-1">
                      {opt.image && (
                        <div className="relative w-16 h-16 flex-shrink-0">
                          <img src={opt.image} className="w-full h-full object-cover rounded-[6px]" alt="opt" />
                          <button
                            onClick={() => handleOptionImage(currentQuestion.id, opt.id, undefined)}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                          >
                            ×
                          </button>
                          <div className="mt-2">
                            <input
                              type="text"
                              placeholder="Alt text (optional)"
                              value={(mediaAltTexts[`opt_${currentQuestion.id}_${opt.id}`] && mediaAltTexts[`opt_${currentQuestion.id}_${opt.id}`][0]) || ''}
                              onChange={(e) => {
                                const key = `opt_${currentQuestion.id}_${opt.id}`;
                                setMediaAltTexts((prev) => ({ ...prev, [key]: [e.target.value] }));
                              }}
                              className="w-full mt-1 px-2 py-1 text-sm border border-gray-200 rounded-[6px]"
                            />
                          </div>
                        </div>
                      )}
                      <input
                        value={opt.text}
                        onChange={(e) =>
                          setQuestions((prev) =>
                            prev.map((qq) =>
                              qq.id === currentQuestion.id
                                ? { ...qq, options: qq.options.map((oo) => (oo.id === opt.id ? { ...oo, text: e.target.value } : oo)) }
                                : qq
                            )
                          )
                        }
                        className="flex-1 bg-transparent text-[14px] text-gray-900 outline-none"
                        placeholder="Enter option text"
                      />
                    </div>

                    <div className="flex items-center gap-3 ml-auto">
                      <input
                        type="file"
                        className="hidden"
                        id={`optfile-${currentQuestion.id}-${opt.id}`}
                        onChange={(e) => handleOptionImage(currentQuestion.id, opt.id, e.target.files ? e.target.files[0] : undefined)}
                      />
                      <label
                        htmlFor={`optfile-${currentQuestion.id}-${opt.id}`}
                        className="text-[13px] text-[#C85103] cursor-pointer hover:underline font-medium"
                      >
                        {opt.image ? 'Change' : 'Upload'}
                      </label>
                      <button
                        onClick={() => removeOption(currentQuestion.id, opt.id)}
                        className="text-[13px] text-gray-500 hover:text-red-600 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => addOption(currentQuestion.id)}
                className="mt-4 w-full py-3 border-gray-300 rounded-[8px] text-[14px] text-gray-600 font-medium"
              >
                + Add Option
              </button>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={addQuestion}
              className="w-full py-3 border-2 border-dashed border-[#C85103] rounded-[8px] text-[14px] text-[#C85103] font-medium hover:bg-orange-50 transition-colors"
            >
              + Add Question
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen bg-[#FFFFFF] flex overflow-hidden">
      <Sidebar variant="admin" />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="w-full mx-auto">
          <div className="bg-white rounded-[12px] overflow-hidden shadow-sm">
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 flex items-center justify-center rounded-[8px] hover:bg-gray-100 transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                  <div>
                    <h1 className="text-[24px] font-helvetica sm:text-[24px] font-bold text-black">Create New Quiz</h1>
                    <p className="text-[16px] font-helvetica font-normal sm:text-[16px] text-[#696F79] mt-1">
                      Add questions, set answers and configure quiz settings
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
                  <div className="hidden sm:flex items-center gap-2 mr-2">
                    <input
                      type="text"
                      placeholder="Admin token (optional)"
                      value={adminTokenInput || ''}
                      onChange={(e) => setAdminTokenInput(e.target.value)}
                      className="px-3 py-2 rounded-[6px] border border-gray-200 text-sm w-48"
                    />
                    <button
                      onClick={() => {
                        if (adminTokenInput) {
                          localStorage.setItem('admin_token', adminTokenInput);
                          alert('Admin token saved');
                        } else {
                          localStorage.removeItem('admin_token');
                          alert('Admin token cleared');
                        }
                      }}
                      className="px-3 py-2 bg-gray-100 rounded-[6px] text-sm"
                    >
                      Save Token
                    </button>
                  </div>
                  <button
                    onClick={saveDraft}
                    disabled={isSaving || isPublishing}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-white border border-gray-300 rounded-[8px] font-helvetica text-[14px] text-[#2B2B2B] font-medium hover:bg-gray-50 transition-colors"
                  >
                    {isSaving ? 'Saving...' : 'Save Draft'}
                  </button>
                  <button
                    onClick={publish}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-[#C85103] text-white rounded-[8px] text-[14px] font-medium hover:bg-[#B34803] transition-colors"
                  >
                    Preview
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 lg:p-8">
              

              {renderStepContent()}

              <div className="flex flex-col sm:flex-row sm:justify-end gap-3 mt-6 pt-6">
                <Button
                  variant="cancel"
                  className="h-10 w-full sm:w-auto"
                  onClick={() => {
                    // if on settings/preview (beyond last question), go back to last question
                    if (currentStep > questions.length) {
                      setCurrentStep(questions.length || 1);
                    } else {
                      navigate(-1);
                    }
                  }}
                >
                  {currentStep > questions.length ? 'prev' : 'Cancel'}
                </Button>
                <Button variant="publish" className="h-10 w-full sm:w-auto" onClick={publish} disabled={isSaving || isPublishing}>
                  {isPublishing ? 'Publishing...' : 'Preview & Publish'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateQuiz;