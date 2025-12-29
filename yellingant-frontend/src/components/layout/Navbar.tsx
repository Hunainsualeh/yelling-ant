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
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex items-center gap-2 pl-16 sm:pl-20 lg:pl-38">

          {/* NAV ITEMS CENTER */}
          <div className="flex justify-center gap-10 mx-auto max-w-[720px]">
            {navItems.map((item) => (
              <button
                key={item}
                className="text-[#696F79] font-helvetica font-bold text-[18px] transition hover:text-black"
              >
                {item}
              </button>
            ))}
          </div>

          {/* ACTIONS RIGHT */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button className="p-1 rounded-full hover:bg-gray-100 transition">
              <Search className="w-5 h-5 text-[#696F79]" />
            </button>

            <Button variant="join_for_free">Join for Free</Button>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;
