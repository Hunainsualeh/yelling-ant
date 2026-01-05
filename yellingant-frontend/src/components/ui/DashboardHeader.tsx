import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

const DashboardHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between mb-2">
      <div className="relative flex-none order-0 grow-0 w-[379px] h-[40px]">
        <div className="absolute left-[16px] top-[9px] w-[22px] h-[22px] pointer-events-none">
          <svg className="w-full h-full text-[#696F79]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
        <input
          className="w-full h-full bg-[#FAFAFA] rounded-[10px] pl-[44px] pr-3 focus:outline-none font-helvetica font-normal text-[16px] leading-[18px] text-[#696F79] placeholder-[#696F79]"
          placeholder="Search..."
          aria-label="search"
          style={{ letterSpacing: '-0.292683px' }}
        />
      </div>

      <div>
        <Button variant="create_quiz" onClick={() => navigate('/admin/create')}>+ Create New Quiz</Button>
      </div>
    </header>
  );
};

export default DashboardHeader;
