import { useState, useEffect } from 'react';
import EditorsPicksHeading from '../components/ui/EditorsPicksHeading.tsx';
import EditorCard from '../components/ui/EditorCard.tsx';
import { request } from '../utils/api';

interface EditorPickItem {
  id: string | number;
  image: string;
  title: string;
  views?: string;
  slug: string;
}

const EditorsPicks = () => {
  const [picks, setPicks] = useState<EditorPickItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedQuizzes = async () => {
      try {
        // Fetch all published quizzes
        const response = await request('/api/quiz');
        // API returns { quizzes: [...], total, limit, offset }
        const quizzes = response?.quizzes || response || [];
        
        // Filter for featured quizzes (metadata.featured === true)
        const featuredQuizzes = quizzes.filter((quiz: any) => {
          const metadata = quiz.metadata || quiz.quiz_data?.metadata || {};
          return metadata.featured === true || metadata.editorsPick === true;
        });

        // Map to our format (up to 4 quizzes)
        const mappedPicks: EditorPickItem[] = featuredQuizzes.slice(0, 4).map((quiz: any) => ({
          id: quiz.id || quiz.slug,
          image: quiz.cover_image || quiz.hero_image || quiz.quiz_data?.heroImage || 
                 `https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop`,
          title: quiz.title || quiz.quiz_data?.title || 'Untitled Quiz',
          views: quiz.views ? `${(quiz.views / 1000).toFixed(1)}k` : undefined,
          slug: quiz.slug
        }));
        setPicks(mappedPicks);
      } catch (error) {
        console.error('Failed to fetch featured quizzes:', error);
        setPicks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedQuizzes();
  }, []);

  // Show skeleton while loading
  if (loading) {
    return (
      <section className="py-12 bg-white w-full">
        <div className="w-[90%] mx-auto">
          <div className="w-full flex">
            <div className="w-full md:max-w-[220px]">
              <EditorsPicksHeading />
            </div>
          </div>
          <div className="mt-8 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[30px]">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-full h-[200px] bg-gray-100 animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Don't render section if no editor's picks
  if (picks.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-white w-full">
      <div className="w-[90%] mx-auto">
        <div className="w-full flex">
          <div className="w-full md:max-w-[220px]">
            <EditorsPicksHeading />
          </div>
        </div>
        <div className="mt-8 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[30px]">
          {picks.map((card) => (
            <div key={card.id} className="w-full">
              <EditorCard image={card.image} title={card.title} slug={card.slug} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EditorsPicks;
