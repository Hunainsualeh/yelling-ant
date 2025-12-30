import { useState, useEffect } from 'react';
import QuizCard from '../components/ui/QuizCard.tsx';
import { Flame } from '../components/ui/Icons.tsx';
import { request } from '../utils/api';

interface TrendingSectionProps {
  showHeading?: boolean;
  selectedCategory?: string;
}

const TrendingSection = ({ showHeading = true, selectedCategory = 'Latest' }: TrendingSectionProps) => {
  const [quizzes, setQuizzes] = useState<any[]>([]);

  useEffect(() => {
      const fetchQuizzes = async () => {
          try {
              let query = '/api/quiz?limit=8';
              if (selectedCategory && selectedCategory !== 'Latest') {
                  query += `&category=${encodeURIComponent(selectedCategory)}`;
              }
              const data = await request(query);
              if (data && data.quizzes) {
                  setQuizzes(data.quizzes.map((q: any) => ({
                      id: q.id,
                      image: q.hero_image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop',
                      title: q.title,
                      subtitle: q.dek || '',
                      views: '0 plays',
                      badge: q.primary_colony || q.tags?.[0] || 'New',
                      slug: q.slug
                  })));
              }
          } catch (e) {
              console.error("Failed to fetch quizzes", e);
          }
      }
      fetchQuizzes();
  }, [selectedCategory]);

  return (
    <section className="py-12">
      <div className="w-[90%] mx-auto">
        {showHeading && (
          <div className="flex items-center gap-[12px] h-[40px] opacity-100 mb-8">
            {/* Icon Container */}
            <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 mt-2">
              <Flame className="w-12 h-12 text-red-500" />
            </div>

            {/* Heading */}
            <h2 className="font-helvetica font-normal text-[24px] md:text-[36px] leading-[32px] md:leading-[40px] tracking-[0.37px] text-[#101828] flex items-center">
              Trending Right Now
            </h2>
          </div>
        )}
        
        
        <div className="grid gap-x-[10px] gap-y-[12px] justify-items-center" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {quizzes.map((quiz) => (
             <QuizCard key={quiz.id} {...quiz} showTypePill={false} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;