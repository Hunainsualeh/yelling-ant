import EditorsPicksHeading from '../components/ui/EditorsPicksHeading.tsx';
import EditorCard from '../components/ui/EditorCard.tsx';

const editorsPicks = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop',
    title: 'Unleash Your Inner Athlete',
    views: '1.2k',
    slug: 'inner-athlete'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
    title: "Plan Your Perfect Day & We'll Reveal Your Soulmate 💕",
    views: '2.3k',
    slug: 'perfect-day'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=600&h=400&fit=crop',
    title: 'Which Fictional Universe Should You Actually Live In? 🌟',
    views: '980',
    slug: 'fictional-universe'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1511376777868-611b54f68947?w=600&h=400&fit=crop',
    title: "Build a Spotify Playlist & We'll Rate Your Taste 🎵",
    views: '1.7k',
    slug: 'spotify-playlist'
  },
];

const EditorsPicks = () => {
  return (
    <section className="py-12 bg-white w-full">
      <div className="w-[90%] mx-auto">
        <div className="w-full flex">
          <div className="w-full max-w-[220px]">
            <EditorsPicksHeading />
          </div>
        </div>
        <div className="mt-8 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[30px]">
          {editorsPicks.map((card) => (
            <div key={card.id} className="w-full max-w-[384px] mx-auto ">
              <EditorCard image={card.image} title={card.title} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EditorsPicks;
