import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import QuizPage from './quiz/page.tsx'
import QuizResultPage from './quiz/result-page';
import AdminDashboard from './admin/Admindashboard';
import CreateQuiz from './admin/CreateQuiz';
import QuizList from './admin/QuizList';
import QuizDrafts from './admin/QuizDrafts';
import PreviewQuiz from './admin/PreviewQuiz';
import AdsManagement from './admin/AdsManagement';
import AdSlots from './admin/AdSlots';
import CreateAd from './admin/CreateAd';
import { ToastProvider } from './components/ui/toast';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/quizzes" element={<QuizList />} />
          <Route path="/admin/drafts" element={<QuizDrafts />} />
          <Route path="/admin/preview/:slug" element={<PreviewQuiz />} />
          <Route path="/admin/create" element={<CreateQuiz />} />
          <Route path="/admin/quiz/new" element={<CreateQuiz />} />
          <Route path="/admin/quiz/edit/:slug" element={<CreateQuiz />} />
          <Route path="/admin/ads-management" element={<AdsManagement />} />
          <Route path="/admin/ads/new" element={<CreateAd />} />
          <Route path="/admin/ads/edit/:id" element={<CreateAd />} />
          <Route path="/admin/ad-slots" element={<AdSlots />} />
          <Route path="/quiz/:slug" element={<QuizPage />} />
          <Route path="/quiz/:slug/result" element={<QuizResultPage />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  </StrictMode>,
)
