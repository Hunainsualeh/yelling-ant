const categoryChips = [
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
    label: "Personality",
    icon: "https://c.animaapp.com/min29ubxIAQkvK/img/icon-9.svg",
    isActive: false,
    gradient: "linear-gradient(90deg, rgba(251,44,54,1) 0%, rgba(240,177,0,1) 100%)",
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

const QuizCategories = () => {
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
              className={
                `flex items-center justify-center gap-2 px-4 md:px-6 py-2 md:py-3 h-[40px] md:h-[48px] rounded-xl whitespace-nowrap transition-all text-center flex-shrink-0 md:flex-1 w-auto` +
                (chip.isActive
                  ? ' text-white border-none bg-gradient-to-r from-[#c27aff] to-[#9810fa]'
                  : ' text-[#980ffa] border-2 border-[#980ffa] bg-transparent hover:bg-gradient-to-r hover:from-[#c27aff] hover:to-[#9810fa] hover:text-white hover:border-none')
              }
            >
              <img
                className="w-5 h-5"
                alt={`${chip.label} icon`}
                src={chip.icon}
              />
              <span className="font-helvetica font-normal text-[14px] md:text-[16px] leading-[24px] tracking-[-0.31px] text-center w-auto">
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
