import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

const DashboardHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between mb-2">
      <div className="relative">
        <input
          className="border rounded-lg px-3 py-2 w-64 pr-10"
          placeholder="Search..."
          aria-label="search"
        />
        <div className="absolute right-1 top-1/2 -translate-y-1/2">
          <Button variant="search_icon">
            <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2" />
            </svg>
          </Button>
        </div>
      </div>

      <div>
        <Button variant="create_quiz" onClick={() => navigate('/admin/create')}>+ Create New Quiz</Button>
      </div>
    </header>
  );
};

export default DashboardHeader;
