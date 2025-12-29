import QuizCard from '../components/ui/QuizCard.tsx';
import { Flame } from '../components/ui/Icons.tsx';
import { getQuizBySlug, getAllQuizzes } from '../quiz/data/quizzes';

const trendingQuizzes = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop',
    title: "Build a Pizza & We'll Guess Your Emotional Age 🍕",
    subtitle: 'But can we guess your favorite topping?',
    views: '350k plays',
    badge: 'Easy',
    slug: 'build-a-pizza'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1484406566174-9da000fda645?w=600&h=400&fit=crop',
    title: '[Image-Options] Pick the Aesthetic: Choose the Images that Match Your Vibe ✨',
    subtitle: '90% based on vibes only',
    views: '420k plays',
    badge: 'Medium',
    slug: 'image-options-demo'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=400&fit=crop',
    title: '[Text-Input] Complete the Quote (Text Input Demo)',
    subtitle: 'Type your answer and submit',
    views: '28k plays',
    slug: 'text-input-demo'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=400&fit=crop',
    title: '[Slider] How Much Do You Like Coffee? (Slider Demo)',
    subtitle: 'Drag the slider to answer',
    views: '18k plays',
    slug: 'slider-demo'
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop',
    title: "Order a Feast & We'll Tell You Your Love Language 💕",
    subtitle: 'This quiz knows about life',
    views: '550k plays',
    badge: 'Easy',
    slug: 'order-a-feast-figma'
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=600&h=400&fit=crop',
    title: '[Personality] Build Your Dream Outfit & We Will Expose You 👗',
    subtitle: 'This quiz knows the real you',
    views: '195k plays',
    slug: 'dream-outfit'
  },
  {
    id: 7,
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=400&fit=crop',
    title: '[Personality] Pick Some Animals & Discover Your Inner Chaos Energy 🐾',
    subtitle: 'Tag yourself, chaotic neutral vibes',
    views: '670k plays',
    badge: 'HOT',
    slug: 'chaos-animals'
  },
  {
    id: 8,
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=400&fit=crop',
    title: '[Personality] Pick Some Animals & Discover Your Inner Chaos Energy 🐾',
    subtitle: 'Tag yourself, chaotic neutral vibes',
    views: '670k plays',
    slug: 'chaos-animals'
  },
];

interface TrendingSectionProps {
  showHeading?: boolean;
}

const TrendingSection = ({ showHeading = true }: TrendingSectionProps) => {
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
            <h2 className="font-helvetica font-normal text-[36px] leading-[40px] tracking-[0.37px] text-[#101828] flex items-center">
              Trending Right Now
            </h2>
          </div>
        )}
        
        
        <div className="grid gap-x-[10px] gap-y-[12px]" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
          {trendingQuizzes.map((quiz) => {
            // Try to resolve the canonical quiz by slug first
            const resolvedBySlug = quiz.slug ? getQuizBySlug(quiz.slug) : undefined;
            // Fallback: try to find a quiz by matching title (helps if the trending entry had the wrong slug)
            const resolvedByTitle = !resolvedBySlug
              ? getAllQuizzes().find((q) => q.title === (quiz.title?.replace(/^\[Personality\]\s*/i, '') ?? quiz.title))
              : undefined;

            const resolved = resolvedBySlug ?? resolvedByTitle;
            const resolvedTitle = resolved?.title ?? quiz.title;
            const resolvedSlug = resolved?.slug ?? quiz.slug;

            return <QuizCard key={quiz.id} {...quiz} title={resolvedTitle} slug={resolvedSlug} showTypePill={false} />;
          })}
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;