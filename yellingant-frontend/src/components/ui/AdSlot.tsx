import { useState } from 'react';

interface AdSlotProps {
  slotId?: string;
  className?: string;
  variant?: 'default' | 'vertical-cards';
}

const AdSlot = ({ slotId, className = '', variant = 'default' }: AdSlotProps) => {
  // Animation state for each card
  const [activeCard, setActiveCard] = useState<null | 1 | 2>(null);

  if (variant === 'vertical-cards') {
    return (
      <div className={`w-[245px] h-[678px] flex flex-col gap-[64px] ${className}`}>
        {/* Upper Ad Card */}
        <div
          className={`w-[245px] h-[296px] rounded-[12px] border border-t border-gray-200 bg-white overflow-hidden shadow-sm flex items-center justify-center cursor-pointer transition-transform transition-shadow duration-300 ${activeCard === 1 ? 'scale-105 shadow-2xl' : ''}`}
          onClick={() => {
            setActiveCard(1);
            setTimeout(() => setActiveCard(null), 300);
          }}
        >
          <div className="text-center p-4 select-none">
            <p className="text-gray-400 text-sm font-medium">Advertisement</p>
            <p className="text-gray-300 text-xs mt-1">Ad Slot 1</p>
          </div>
        </div>
        {/* Lower Ad Card */}
        <div
          className={`w-[245px] h-[318px] rounded-[12px] border border-t border-gray-200 bg-white overflow-hidden shadow-sm flex items-center justify-center cursor-pointer transition-transform transition-shadow duration-300 ${activeCard === 2 ? 'scale-105 shadow-2xl' : ''}`}
          onClick={() => {
            setActiveCard(2);
            setTimeout(() => setActiveCard(null), 300);
          }}
        >
          <div className="text-center p-4 select-none">
            <p className="text-gray-400 text-sm font-medium">Advertisement</p>
            <p className="text-gray-300 text-xs mt-1">Ad Slot 2</p>
          </div>
        </div>
      </div>
    );
  }
  // Default single ad slot
  return (
    <div 
      className={`bg-gray-100 rounded-lg flex items-center justify-center min-h-[120px] ${className}`}
      data-ad-slot={slotId}
    >
      <div className="text-center p-4">
        <p className="text-gray-400 text-sm font-medium">Advertisement</p>
        <p className="text-gray-300 text-xs mt-1">{slotId}</p>
      </div>
    </div>
  );
};

export default AdSlot;
