import { Instagram, X, LinkedIn, Email, Telegram } from '../ui/Icons.tsx';

const Footer = () => {
  return (
    <footer className="relative bg-black h-[286px] ">
      <div className="w-full mx-auto py-4 grid grid-cols-1 md:grid-cols-4 gap-8 h-full items-start ml-[90px]">
        
        {/* Logo & Tagline */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-1">
            <img src="/Logo-footer.svg" alt="Yelling Ant Logo" className="w-[298px] h-[124px] opacity-100 rotate-0 object-contain" />
          </div>
          <p className="font-normal font-helvetica font-weight:400 text-[14px] text-[#FFFFFF]">
        
            Quizzes That Know Your Humor, Your Vibes, and Your Culture
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[#B3B6B6] font-helvetica font-weight:400 font-medium text-[16px] ">Categories</h3>
          <ul className="flex text-[#FFFFFF] font-weight:400 font-helvetica font-normal text-[14px] flex-col gap-2">
            <li><a href="#" className="  hover:text-gray-900 transition">Personality</a></li>
            <li><a href="#" className="  hover:text-gray-900 transition">Love & Relationships</a></li>
            <li><a href="#" className="  hover:text-gray-900 transition">Pop Culture</a></li>
            <li><a href="#" className="  hover:text-gray-900 transition">Food & Lifestyle</a></li>
          </ul>
        </div>

        {/* About */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[#B3B6B6] font-helvetica font-weight:400 font-medium text-[16px]">About</h3>
          <ul className="flex text-[#FFFFFF] font-weight:400 font-helvetica font-normal text-[14px] flex-col gap-2">
            <li><a href="#" className=" hover:text-gray-900 transition">About Us</a></li>
            <li><a href="#" className=" hover:text-gray-900 transition">How It Works</a></li>
            <li><a href="#" className=" hover:text-gray-900 transition">Privacy Policy</a></li>
            <li><a href="#" className=" hover:text-gray-900 transition">Contact</a></li>
          </ul>
        </div>

        {/* Follow Us */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[#B3B6B6] font-medium font-helvetica font-weight:400 text-[16px]">Share this Quiz</h3>
          <div className="flex gap-3 mt-2">
            <a href="#" className="w-10 h-10 bg-[#C85103] rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors">
              <Instagram className="w-5 h-5 text-white" />
            </a>
            <a href="#" className="w-10 h-10 bg-[#C85103] rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors">
              <X className="w-5 h-5 text-white" />
            </a>
            <a href="#" className="w-10 h-10 bg-[#C85103] rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors">
              <LinkedIn className="w-5 h-5 text-white" />
            </a>
            <a href="mailto:hello@example.com" className="w-10 h-10 bg-[#C85103] rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors" aria-label="Email">
              <Email className="w-5 h-5 text-white" />
            </a>
            <a href="https://t.me/yourhandle" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#C85103] rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors" aria-label="Telegram">
              <Telegram className="w-5 h-5 text-white" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
