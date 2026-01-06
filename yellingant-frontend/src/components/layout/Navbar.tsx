"use client";

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import Button from "../ui/Button";

const Navbar = () => {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const navItems = [
    "Yelling Ant",
    "Quizzes",
    "Quiz Colony",
    "Shows",
    "Blog",
    "Shop",
  ];

  // Focus input when search opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results using react-router
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  // Close search on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isSearchOpen) {
        setIsSearchOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isSearchOpen]);

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
            {/* Expanding Search Bar */}
            <div className="relative flex items-center">
              <form
                onSubmit={handleSearch}
                className={`
                  flex items-center overflow-hidden transition-all duration-300 ease-in-out
                  ${isSearchOpen 
                    ? 'w-[200px] md:w-[280px] bg-gray-100 rounded-full border border-gray-200' 
                    : 'w-8'
                  }
                `}
              >
                {/* Search Icon Button (always visible) */}
                <button
                  type="button"
                  onClick={() => {
                    if (!isSearchOpen) {
                      setIsSearchOpen(true);
                    } else if (searchQuery.trim()) {
                      handleSearch({ preventDefault: () => {} } as React.FormEvent);
                    }
                  }}
                  className={`
                    p-1.5 rounded-full transition-colors flex-shrink-0
                    ${isSearchOpen ? 'hover:bg-gray-200 ml-1' : 'hover:bg-gray-100'}
                  `}
                >
                  <Search className="w-5 h-5 text-[#696F79]" />
                </button>

                {/* Search Input (appears when expanded) */}
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search quizzes..."
                  className={`
                    bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400
                    transition-all duration-300
                    ${isSearchOpen ? 'w-full px-2 py-1.5' : 'w-0 p-0'}
                  `}
                />

                {/* Close Button (appears when expanded) */}
                {isSearchOpen && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery("");
                    }}
                    className="p-1.5 mr-1 rounded-full hover:bg-gray-200 transition-colors flex-shrink-0"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                )}
              </form>
            </div>

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

