import React from 'react';


interface AdContainerProps {
  children: React.ReactNode;
  className?: string;
  heightClass?: string; // e.g. 'h-[236px]'
  widthClass?: string; // e.g. 'w-[1280px]'
}

const AdContainer: React.FC<AdContainerProps> = ({ children, className = '', heightClass = '', widthClass = '' }) => {
  return (
    <div
      className={`rounded-[16px] border border-[#B3B6B6] opacity-100 bg-white mx-auto flex items-center justify-center ${widthClass} ${heightClass} ${className}`}
    >
      {children}
    </div>
  );
};

export default AdContainer;
