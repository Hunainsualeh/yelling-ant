import React from 'react';
import { Link2Icon } from 'lucide-react';
import Header from '../../components/layout/Header';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import QuizCategories from '../../sections/QuizCategories';
import TrendingSection from '../../sections/TrendingSection';
import AdSlot from '../../components/ui/AdSlot';
import AdContainer from '../../components/ui/AdContainer';
import Button, { JoinYellingAntButton } from '../../components/ui/Button';

interface QuizResultProps {
  quizTitle?: string;
  onRestart?: () => void;
  score?: number;
  result?: {
    image: string;
    title: string;
    description: string;
  };
}

export const QuizResult: React.FC<QuizResultProps> = ({
  score = 75,
  onRestart,
  result = {
    image: '',
    title: 'You liked PBS growing up',
    description: "You're definitely someone who watched their fair share of shows on PBS, but not a ton. You probably watched Barney & Friends or Bob the Builder but might not have heard of Wishbone. You had a wide variety of TV shows you loved in the '90s and '00s, I'm sure"
  }
}) => {
  const handleShare = (platform?: string) => {
    const url = window.location.href;
    const text = `I scored ${score}% on this quiz!`;
    
    if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'pinterest') {
      window.open(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(text)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'link') {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    } else {
      navigator.clipboard.writeText(`${text}\n${url}`);
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
            <AdSlot variant="vertical-cards" />
          </div>

          <div className="w-full max-w-[798px] mx-auto relative overflow-visible xl:col-start-2">
            {/* Result Modal/Card */}
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden relative -translate-y-4">
              
              {/* Score Badge - Top Left */}
              {score !== undefined && (
                <div className="absolute top-6 left-6 z-10">
                  <div className="relative w-20 h-20">
                    {/* Circle Progress */}
                    <svg className="w-20 h-20 transform -rotate-90">
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="#f3f4f6"
                        strokeWidth="6"
                        fill="none"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="#fbbf24"
                        strokeWidth="6"
                        fill="none"
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
              <div className="relative w-full pt-12 pb-8 px-8 flex justify-center">
                <img
                  src={result.image}
                  alt={result.title}
                  className="w-64 h-64 object-contain"
                />
              </div>

              {/* Result Content */}
              <div className="px-8 pb-8 text-center">
                <h2 className="text-[32px] md:text-[36px] font-bold text-[#111827] mb-2 font-['Helvetica','Arial',sans-serif]">
                  {result.title}
                </h2>
                {score !== undefined && (
                  <p className="text-gray-600 mb-4 text-sm">
                    You scored better than {score}% of all other quiz-takers.
                  </p>
                )}
                <p className="text-base text-[#6b7280] leading-relaxed font-['Helvetica','Arial',sans-serif] max-w-[600px] mx-auto border-b border-gray-300">
                  {result.description}
                </p>
              </div>

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
                  onClick={() => handleShare('link')}
                  className="w-12 h-12 rounded-full border-2 border-[#6d28d9] flex items-center justify-center hover:bg-[#6d28d9] hover:text-white transition-colors group"
                  aria-label="Copy link"
                >
                  <Link2Icon className="w-5 h-5 text-[#6d28d9] group-hover:text-white" />
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  className="w-12 h-12 rounded-full border-2 border-[#6d28d9] flex items-center justify-center hover:bg-[#6d28d9] hover:text-white transition-colors group"
                  aria-label="Share on Facebook"
                >
                  <svg className="w-5 h-5 text-[#6d28d9] group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>
                <button
                  onClick={() => handleShare('pinterest')}
                  className="w-12 h-12 rounded-full border-2 border-[#6d28d9] flex items-center justify-center hover:bg-[#6d28d9] hover:text-white transition-colors group"
                  aria-label="Share on Pinterest"
                >
                  <svg className="w-5 h-5 text-[#6d28d9] group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
                  </svg>
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className="w-12 h-12 rounded-full border-2 border-[#6d28d9] flex items-center justify-center hover:bg-[#6d28d9] hover:text-white transition-colors group"
                  aria-label="Share on Twitter"
                >
                  <svg className="w-5 h-5 text-[#6d28d9] group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </button>
              </div>
              </div>
            </div>

            {/* Spread button: placed outside the result card and aligned under social icons */}
            <div className="flex justify-end mt-4 mr-8 relative">
              <img 
                src="/images/arrow.png" 
                alt="arrow" 
                className="absolute -top-24 right-28 w-32 h-32 object-contain pointer-events-none"
              />
              <button
                onClick={() => handleShare()}
                className="w-32 h-32 rounded-full bg-gradient-to-br from-[#9333ea] to-[#7c3aed] text-white shadow-2xl hover:scale-110 transition-transform duration-300 flex flex-col items-center justify-center gap-1"
              >
              
                <span className="text-xs font-bold uppercase tracking-wider">Spread</span>
                <span className="text-xs font-bold uppercase tracking-wider">Awesome!</span>
              </button>
            </div>
          </div>

          {/* Right Vertical Ad Slot */}
          <div className="hidden xl:flex items-start sticky top-8 xl:col-start-3">
            <AdSlot variant="vertical-cards" />
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
        <AdSlot slotId="YA_QHOME_FEED_003" />
      </AdContainer>
    </div>
  );
};