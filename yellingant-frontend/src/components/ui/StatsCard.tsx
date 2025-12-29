import React from 'react';

type Props = {
  title: string;
  value: string | number;
  delta?: string; // e.g. "8.5%" or "1.3% Up from past week"
  deltaType?: 'up' | 'down' | 'neutral'; // determines icon and color
  icon?: React.ReactNode;
  iconBgColor?: string; // e.g. 'bg-purple-100', 'bg-green-100'
  subtitle?: string; // e.g. "From past two months"
};

const StatsCard: React.FC<Props> = ({ 
  title, 
  value, 
  delta, 
  deltaType = 'neutral',
  icon, 
  iconBgColor = 'bg-purple-50',
  subtitle 
}) => {
  const getDeltaColor = () => {
    if (deltaType === 'up') return 'text-green-600';
    if (deltaType === 'down') return 'text-red-600';
    return 'text-gray-600';
  };

  const getDeltaIcon = () => {
    if (deltaType === 'up') {
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M 6 18 L 10 14 L 14 16 L 18 12 L 18 12 L 21 9" 
                stroke="#14b8a6" 
                strokeWidth={1.2} 
                strokeLinecap="round" 
                strokeLinejoin="round"
                fill="none"/>
          <polyline points="17,9 21,9 21,13" 
                    stroke="#14b8a6" 
                    strokeWidth={1.2} 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    fill="none"/>
        </svg>
      );
    }
    if (deltaType === 'down') {
      return (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M 6 6 L 10 10 L 14 8 L 18 12 L 18 12 L 21 15" 
                stroke="#ec4899" 
                strokeWidth={1.2} 
                strokeLinecap="round" 
                strokeLinejoin="round"
                fill="none"/>
          <polyline points="17,15 21,15 21,11" 
                    stroke="#ec4899" 
                    strokeWidth={1.2} 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    fill="none"/>
        </svg>
      );
    }
    return null;
  };

  return (
    <div className="relative bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start mb-3 relative">
        <div className="font-helvetica text-[#202224] text-[16px] font-normal">{title}</div>
        {icon && (
          <div className={`absolute right-[-20px] top-[-20px] w-[72px] h-[72px] rounded-lg ${iconBgColor} flex items-center justify-center`}>{icon}</div>
        )}
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between">
          <div className="font-gotham text-[28px] font-medium text-[#202224]">{value}</div>
        </div>

        {(delta || subtitle) && (
          <div className="mt-3">
            <div className={`flex items-center gap-3 text-sm font-medium ${getDeltaColor()}`}>
              {getDeltaIcon()}
              <span className="whitespace-nowrap">{delta}</span>
              {subtitle && <span className="text-[13px] font-helvetica text-[#6B7280] ml-3">{subtitle}</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;