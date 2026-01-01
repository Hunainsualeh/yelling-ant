import React from 'react';
import { Link2Icon, CheckCircle, XCircle } from 'lucide-react';
import { Facebook, X, LinkedIn, Email, Telegram } from '../../components/ui/Icons';
import Header from '../../components/layout/Header';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import QuizCategories from '../../sections/QuizCategories';
import TrendingSection from '../../sections/TrendingSection';
import AdSlot from '../../components/ui/AdSlot';
import AdContainer from '../../components/ui/AdContainer';
import Button, { JoinYellingAntButton } from '../../components/ui/Button';
import type { AnswerSummary } from '../types';

interface QuizResultProps {
  quizTitle?: string;
  onRestart?: () => void;
  score?: number;
  quizType?: 'personality' | 'trivia' | 'scored' | 'image-options' | 'figma-image' | 'points' | 'this-that';
  result?: {
    image: string;
    title: string;
    description: string;
  };
  answerSummaries?: AnswerSummary[];
  showAnswerSummary?: boolean;
}

export const QuizResult: React.FC<QuizResultProps> = ({
  score,
  onRestart,
  quizType = 'personality',
  result = {
    image: '',
    title: 'You liked PBS growing up',
    description: "You're definitely someone who watched their fair share of shows on PBS, but not a ton. You probably watched Barney & Friends or Bob the Builder but might not have heard of Wishbone. You had a wide variety of TV shows you loved in the '90s and '00s, I'm sure"
  },
  answerSummaries = [],
  showAnswerSummary = false,
}) => {
  const [showSummary, setShowSummary] = React.useState(showAnswerSummary);
  const isTrivia = quizType === 'trivia' || quizType === 'scored';
  const hasAnswerSummary = answerSummaries && answerSummaries.length > 0;
  
  const handleShare = (platform?: string) => {
    const url = window.location.href;
    const text = `I got: ${result.title}`;
    
    if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'x') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'telegram') {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
    } else if (platform === 'email') {
      window.open(`mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'link') {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="w-full bg-white flex flex-col overflow-x-hidden">
      {/* Header */}
      <Header />
      
      {/* Navbar */}
      <Navbar />
      
      {/* Quiz Categories */}
      <QuizCategories />
      
      {/* Main Result Container */}
      <div className="w-full py-8 px-10">
        <div className="w-full mx-auto grid grid-cols-1 xl:grid-cols-[240px_minmax(0,798px)_240px] justify-center gap-4 items-start px-0">
          
          {/* Left Vertical Ad Slot */}
          <div className="hidden xl:flex items-start sticky top-8 xl:col-start-1">
            <AdSlot variant="vertical-cards" position="left" />
          </div>

          <div className="w-full max-w-[798px] mx-auto relative overflow-visible xl:col-start-2">
            {/* Result Modal/Card */}
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden relative -translate-y-4">
              
              {/* Score Badge for Trivia - Top Left */}
              {isTrivia && score !== undefined && (
                <div className="absolute top-6 left-6 z-10">
                  <div className="relative w-20 h-20">
                    <svg className="w-20 h-20 transform -rotate-90">
                      <circle cx="40" cy="40" r="36" stroke="#f3f4f6" strokeWidth="6" fill="none" />
                      <circle
                        cx="40" cy="40" r="36"
                        stroke={score >= 80 ? '#22c55e' : score >= 60 ? '#fbbf24' : '#ef4444'}
                        strokeWidth="6" fill="none"
                        strokeDasharray={`${2 * Math.PI * 36}`}
                        strokeDashoffset={`${2 * Math.PI * 36 * (1 - score / 100)}`}
                        className="transition-all duration-1000"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-gray-900">{score}%</span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Retake Button - Top Right */}
              <button
                onClick={onRestart}
                className="absolute top-6 right-6 z-10 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="font-medium">Retake Quiz</span>
              </button>

              {/* Result Image/Illustration */}
              {result.image && (
                <div className="relative w-full pt-12 pb-8 px-8 flex justify-center">
                  <img
                    src={result.image}
                    alt={result.title}
                    className="w-64 h-64 object-contain"
                  />
                </div>
              )}

              {/* Result Content */}
              <div className={`px-8 pb-8 text-center ${!result.image ? 'pt-20' : ''}`}>
                <h2 className="text-[32px] md:text-[36px] font-bold text-[#111827] mb-2 font-['Helvetica','Arial',sans-serif]">
                  {result.title}
                </h2>
                <p className="text-base text-[#6b7280] leading-relaxed font-['Helvetica','Arial',sans-serif] max-w-[600px] mx-auto border-b border-gray-300 pb-4">
                  {result.description}
                </p>
                
                {/* Show Answers Button for all quiz types with summaries */}
                {hasAnswerSummary && (
                  <button
                    onClick={() => setShowSummary(!showSummary)}
                    className="mt-4 text-[#6d28d9] font-medium hover:underline flex items-center gap-2 mx-auto"
                  >
                    {showSummary ? 'Hide' : 'View'} Answer Summary
                    <svg className={`w-4 h-4 transition-transform ${showSummary ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                )}
              </div>
              
              {/* Answer Summary Section - works for all quiz types */}
              {showSummary && hasAnswerSummary && (
                <div className="px-8 pb-8">
                  <div className="bg-gray-50 rounded-xl p-4 max-h-[400px] overflow-y-auto">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Your Answers</h3>
                    <div className="space-y-3">
                      {answerSummaries.map((summary, idx) => {
                        // For trivia, show correct/wrong styling; for personality/other, neutral styling
                        const showCorrectWrong = isTrivia && summary.isCorrect !== undefined;
                        const bgClass = showCorrectWrong 
                          ? (summary.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50')
                          : 'border-purple-200 bg-purple-50';
                        
                        return (
                          <div 
                            key={idx} 
                            className={`p-3 rounded-lg border-2 ${bgClass}`}
                          >
                            <div className="flex items-start gap-3">
                              {showCorrectWrong ? (
                                summary.isCorrect ? (
                                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                ) : (
                                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                )
                              ) : (
                                <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <span className="text-white text-xs font-bold">{idx + 1}</span>
                                </div>
                              )}
                              <div className="flex-1">
                                <p className="font-medium text-gray-900 text-sm">Q{idx + 1}: {summary.questionText}</p>
                                <p className={`text-sm ${showCorrectWrong ? (summary.isCorrect ? 'text-green-700' : 'text-red-700') : 'text-purple-700'}`}>
                                  Your answer: {summary.selectedAnswer}
                                </p>
                                {showCorrectWrong && !summary.isCorrect && summary.correctAnswer && (
                                  <p className="text-sm text-green-700">
                                    Correct answer: {summary.correctAnswer}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="px-8 pb-8 flex flex-col sm:flex-row gap-4 items-center justify-center">
                <div className="flex items-center gap-4">
                  {/* Try Another Quiz Button (use UI variant) */}
                  <Button variant="tryAnother" onClick={() => (window.location.href = '/')}>Try Another Quiz</Button>

                  {/* Join Yelling Ant CTA (to the right of Try Another Quiz) */}
                  <JoinYellingAntButton />
                </div>

                {/* Social Share Buttons */}
                <div className="flex items-center gap-3 relative">
                  <button
                    onClick={() => handleShare('facebook')}
                    className="w-10 h-10 bg-[#6d28d9] rounded-full flex items-center justify-center hover:bg-purple-800 transition-colors"
                    aria-label="Share on Facebook"
                  >
                    <Facebook className="w-6 h-6 text-white" />
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="w-10 h-10 bg-[#6d28d9] rounded-full flex items-center justify-center hover:bg-purple-800 transition-colors"
                    aria-label="Share on LinkedIn"
                  >
                    <LinkedIn className="w-6 h-6 text-white" />
                  </button>
                  <button
                    onClick={() => handleShare('x')}
                    className="w-10 h-10 bg-[#6d28d9] rounded-full flex items-center justify-center hover:bg-purple-800 transition-colors"
                    aria-label="Share on X"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                  <button
                    onClick={() => handleShare('telegram')}
                    className="w-10 h-10 bg-[#6d28d9] rounded-full flex items-center justify-center hover:bg-purple-800 transition-colors"
                    aria-label="Share on Telegram"
                  >
                    <Telegram className="w-6 h-6 text-white" />
                  </button>
                  <button
                    onClick={() => handleShare('email')}
                    className="w-10 h-10 bg-[#6d28d9] rounded-full flex items-center justify-center hover:bg-purple-800 transition-colors"
                    aria-label="Share via Email"
                  >
                    <Email className="w-6 h-6 text-white" />
                  </button>
                  <button
                    onClick={() => handleShare('link')}
                    className="w-10 h-10 bg-[#6d28d9] rounded-full flex items-center justify-center hover:bg-purple-800 transition-colors"
                    aria-label="Copy link"
                  >
                    <Link2Icon className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Spread button: placed outside the result card and aligned under social icons */}
            <div className="flex justify-end mt-2 mr-10 relative">
              <img 
                src="/images/arrow.png" 
                alt="arrow" 
                className="absolute -top-24 right-28 w-32 h-32 object-contain pointer-events-none"
              />
              <button
                onClick={() => handleShare()}
                className="w-36 h-36 rounded-full bg-gradient-to-br from-[#9333ea] to-[#7c3aed] text-white shadow-2xl hover:scale-110 transition-transform duration-300 flex flex-col items-center justify-center gap-1 -translate-y-3"
              >
              
                <span className="text-xs font-bold uppercase tracking-wider">Spread</span>
                <span className="text-xs font-bold uppercase tracking-wider">Awesome!</span>
              </button>
            </div>
          </div>

          {/* Right Vertical Ad Slot */}
          <div className="hidden xl:flex items-start sticky top-8 xl:col-start-3">
            <AdSlot variant="vertical-cards" position="right" />
          </div>
        </div>
      </div>

      {/* Trending Section */}
      <div className="w-full mx-auto px-0 pb-8">
        <TrendingSection />
      </div>

      {/* Latest Quizzes Section */}
      <div className="w-full mx-auto px-4 pb-12">
        <div className="flex items-center justify-left ml-[100px]">
          <h2 className="text-[32px] font-helvetica font-normal text-black text-center">Latest Quizzes</h2>
        </div>
        <div className="w-full mx-auto px-0 pb-8">
          <TrendingSection showHeading={false} />
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Bottom Ad Container */}
      <AdContainer heightClass="h-[266px]" widthClass="w-full max-w-none" className="rounded-tl-[4px] rounded-tr-[4px] m-0">
        <AdSlot slotId="YA_QHOME_FEED_003" className="w-full h-full" />
      </AdContainer>
    </div>
  );
};