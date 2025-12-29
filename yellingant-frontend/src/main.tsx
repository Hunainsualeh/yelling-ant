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
import PreviewQuiz from './admin/PreviewQuiz';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/quizzes" element={<QuizList />} />
        <Route path="/admin/preview/:slug" element={<PreviewQuiz />} />
        <Route path="/admin/create" element={<CreateQuiz />} />
        <Route path="/quiz/:slug" element={<QuizPage />} />
        <Route path="/quiz/:slug/result" element={<QuizResultPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
