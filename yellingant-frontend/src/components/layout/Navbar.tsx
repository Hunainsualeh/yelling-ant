"use client";

import { Search } from "lucide-react";
import Button from "../ui/Button";

const Navbar = () => {
  const navItems = [
    "Yelling Ant",
    "Quizzes",
    "Quiz Colony",
    "Shows",
    "Blog",
    "Shop",
  ];

  return (
    <header className="w-full">
      <div className="max-w-screen-xl mx-auto px-0 md:px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-2 pl-0 md:pl-16 sm:pl-20 lg:pl-38">

          {/* NAV ITEMS CENTER */}
          <div className="flex justify-start md:justify-center gap-6 md:gap-10 mx-auto max-w-full md:max-w-[720px] overflow-x-auto w-full px-4 md:px-0 scrollbar-hide">
            {navItems.map((item) => (
              <button
                key={item}
                className="text-[#696F79] font-helvetica font-bold text-[16px] md:text-[18px] transition hover:text-black whitespace-nowrap"
              >
                {item}
              </button>
            ))}
          </div>

          {/* ACTIONS RIGHT */}
          <div className="flex items-center gap-2 flex-shrink-0 pb-4 md:pb-0">
            <button className="p-1 rounded-full hover:bg-gray-100 transition">
              <Search className="w-5 h-5 text-[#696F79]" />
            </button>

            <Button variant="join_for_free">Join for Free</Button>
          </div>

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
    </header>
  );
};

export default Navbar;
