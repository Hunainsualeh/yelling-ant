import type { ReactNode } from 'react';

interface ButtonProps {
  children?: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'quiz' | 'quizSecondary' | 'join_for_free' | 'tryAnother' | 'create_quiz' | 'search_icon' | 'dashed' | 'danger' | 'ghost' | 'publish' | 'cancel' | 'save_draft';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const Button = ({ children, variant = 'primary', size = 'md', className = '', onClick, disabled = false }: ButtonProps) => {
  const baseStyles = 'font-semibold rounded-full transition-all duration-200 inline-flex items-center justify-center';
  
  const variants = {
    primary: 'bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800',
    secondary: 'bg-white text-gray-900 hover:bg-gray-100 border border-gray-300',
    outline: 'bg-transparent text-gray-900 border-2 border-gray-900 hover:bg-gray-900 hover:text-white',
    join_for_free: 'font-helvetica font-bold text-[16px] leading-[28px] text-center align-middle bg-[#C85103] text-white min-w-[129px] max-w-[129px] h-[44px] rounded-[12px] flex items-center justify-center gap-2 px-6 shadow-[0px_25px_50px_-12px_rgba(166,166,166,0.1)] hover:bg-[#B04903] whitespace-nowrap',
    tryAnother: 'font-helvetica font-medium text-[16px] text-[#6d28d9] border-2 border-[#6d28d9] rounded-xl px-8 py-3 bg-transparent hover:bg-[#6d28d9] hover:text-white transition-colors whitespace-nowrap',
    quiz: 'font-helvetica font-bold text-[18px] leading-[28px] text-center align-middle min-w-[218px] h-[48px] flex items-center justify-center gap-2 text-white bg-[#C85103] hover:bg-[#B04903]',
    quizSecondary: 'font-helvetica font-bold text-[18px] leading-[28px] text-center align-middle min-w-[218px] h-[28px] opacity-100 flex items-center justify-center gap-2 text-[#696F79] bg-transparent whitespace-nowrap px-4 hover:opacity-80',
      create_quiz: 'font-helvetica font-bold text-[16px] leading-[24px] text-center bg-[#C85103] text-white rounded-lg px-4 py-2 hover:bg-[#B04903]',
      dashed: 'bg-transparent text-[#696F79] border-2 border-dashed border-gray-300 rounded px-4 py-2 text-sm',
      danger: 'bg-red-50 text-red-600 border border-red-200 rounded px-2 py-1 hover:bg-red-100',
      ghost: 'bg-transparent text-[#2B2B2B] rounded p-2 hover:bg-gray-100',
      publish: 'font-helvetica font-normal text-[14px] leading-[24px] text-center bg-[#C85103] text-white rounded-lg px-4 py-2 hover:bg-[#B04903]',
      cancel: 'bg-white font-helvetica font-normal text-[#2B2B2B] border border-gray-300 rounded-xl px-4 py-2 text-[16px] hover:bg-gray-50',
      save_draft: 'bg-[#FAFAFA]  font-helvetica font-normal text-[#2B2B2B] border border-gray-200 rounded-lg px-4 py-2 text-[16px] hover:bg-gray-50',
    search_icon: 'w-9 h-9 text-[16px] font-helvetica rounded-md  text-gray-600 flex items-center justify-center hover:bg-gray-100',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  // For quiz and quizSecondary variants, don't apply size styles
  const sizeClass = (variant === 'quiz' || variant === 'quizSecondary') ? '' : sizes[size];

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizeClass} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

// Quiz-sized Next button (used in quiz cards)
export const NextButton = ({ children = 'Next', onClick, disabled = false }: ButtonProps & { children?: ReactNode; disabled?: boolean }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-[395px] h-[48px] rounded-[12px] ${disabled ? 'bg-[#E0A28A]' : 'bg-[#C85103]'} flex items-center justify-center gap-2 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span className="font-helvetica font-normal text-white text-[16px] leading-[24px] -tracking-[0.31px]">
        {children}
      </span>
    </button>
  );
};

// Quiz-sized Join Yelling Ant button
export const JoinYellingAntButton = ({ children = 'Join Yelling Ant', onClick }: ButtonProps & { children?: ReactNode }) => {
  return (
    <button
      onClick={onClick}
      className="w-[250px] h-[48px] rounded-[12px] bg-[#C85103] flex items-center justify-center gap-2 cursor-pointer hover:bg-[#B04903] transition-colors"
    >
      <span className="font-helvetica font-normal text-white text-[16px] leading-[24px] -tracking-[0.31px]">
        {children}
      </span>
    </button>
  );
};

// Restart variant used in headers / small controls
export const RestartButton = ({ children = 'Restart', onClick }: ButtonProps & { children?: ReactNode }) => {
  return (
    <button onClick={onClick} className="font-helvetica text-[#696F79] text-[16px] font-normal hover:text-gray-900 transition-colors">
      {children}
    </button>
  );
};

export default Button;