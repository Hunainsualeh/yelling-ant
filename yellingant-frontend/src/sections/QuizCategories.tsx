

const categoryChips = [
  {
    label: "Latest",
    isActive: false,
    gradient: "",
  },
  {
    label: "Personality",
    icon: "https://c.animaapp.com/min29ubxIAQkvK/img/icon-14.svg",
    isActive: true,
    gradient: "linear-gradient(90deg, rgba(194,122,255,1) 0%, rgba(152,16,250,1) 100%)",
  },
  {
    label: "Love",
    icon: "https://c.animaapp.com/min29ubxIAQkvK/img/icon-18.svg",
    isActive: false,
    gradient: "linear-gradient(90deg, rgba(251,100,182,1) 0%, rgba(251,44,54,1) 100%)",
  },
  {
    label: "Pop Celebrity",
    icon: "https://c.animaapp.com/min29ubxIAQkvK/img/icon-4.svg",
    isActive: false,
    gradient: "linear-gradient(90deg, rgba(81,162,255,1) 0%, rgba(79,57,246,1) 100%)",
  },
  {
    label: "Movies",
    icon: "https://c.animaapp.com/min29ubxIAQkvK/img/icon-4.svg",
    isActive: false,
    gradient: "linear-gradient(90deg, rgba(253,199,0,1) 0%, rgba(255,105,0,1) 100%)",
  },
  {
    label: "Food",
    icon: "https://c.animaapp.com/min29ubxIAQkvK/img/icon-13.svg",
    isActive: false,
    gradient: "linear-gradient(90deg, rgba(5,223,114,1) 0%, rgba(0,153,102,1) 100%)",
  },
  {
    label: "Aesthetics",
    icon: "https://c.animaapp.com/min29ubxIAQkvK/img/icon-16.svg",
    isActive: false,
    gradient: "linear-gradient(90deg, rgba(255,99,126,1) 0%, rgba(230,0,118,1) 100%)",
  },

  {
    label: "Culture & History",
    icon: "https://c.animaapp.com/min29ubxIAQkvK/img/icon-8.svg",
    isActive: false,
    gradient: "linear-gradient(90deg, rgba(0,211,242,1) 0%, rgba(21,93,252,1) 100%)",
  },
  {
    label: "Nature",
    icon: "https://c.animaapp.com/min29ubxIAQkvK/img/icon-8.svg",
    isActive: false,
    gradient: "linear-gradient(90deg, rgba(0,211,242,1) 0%, rgba(21,93,252,1) 100%)",
  },
];

interface QuizCategoriesProps {
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
}

const QuizCategories = ({ selectedCategory = 'Latest', onSelectCategory = () => {} }: QuizCategoriesProps) => {
  return (
    <section className="flex flex-col items-center w-full bg-white pt-6 pb-1 mb-[50px] overflow-x-hidden">
      <div className="flex flex-col items-center w-full w-[90%] mx-auto px-4 sm:px-12 lg:px-26">
        <header className="flex items-center w-full h-16 gap-3 justify-start">
          <h2
            className="font-gotham text-[24px] font-medium text-[24px] leading-[32px] text-[#101828] tracking-[0] text-left"
          >
            Quizzes
          </h2>
        </header>

        <div className="flex items-center gap-3 w-full overflow-x-auto md:overflow-visible flex-nowrap md:flex-wrap justify-start md:justify-center pb-4 md:pb-0 scrollbar-hide">
          {categoryChips.map((chip, index) => (
            <button
              key={`chip-${index}`}
              onClick={() => onSelectCategory(chip.label)}
              className={
                `flex items-center justify-center gap-2 px-6 py-3 h-[48px] rounded-xl whitespace-nowrap transition-all text-center flex-shrink-0 md:flex-1 w-auto border ` +
                (chip.label === selectedCategory
                  ? 'bg-[#4B2E83] border-[#4B2E83] text-white'
                  : 'bg-transparent border-[#4B2E83] text-[#4B2E83] hover:bg-[#4B2E83] hover:text-white')
              }
            >
              {chip.icon && (
                <div
                  className="w-5 h-5 bg-current"
                  style={{
                    maskImage: `url(${chip.icon})`,
                    WebkitMaskImage: `url(${chip.icon})`,
                    maskRepeat: 'no-repeat',
                    WebkitMaskRepeat: 'no-repeat',
                    maskPosition: 'center',
                    WebkitMaskPosition: 'center',
                    maskSize: 'contain',
                    WebkitMaskSize: 'contain'
                  }}
                />
              )}
              <span className="font-helvetica font-normal text-[16px] leading-[24px] tracking-[-0.3125px] text-center w-auto">
                {chip.label}
              </span>
            </button>
          ))}
        </div>
        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
              display: none;
          }
          .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
          }
        `}</style>
      </div>
    </section>
  );
};

export default QuizCategories;
