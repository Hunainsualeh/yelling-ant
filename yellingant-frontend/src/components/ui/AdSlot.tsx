import { useState, useEffect } from 'react';
import { request } from '../../utils/api';

interface AdSlotProps {
  slotId?: string;
  className?: string;
  variant?: 'default' | 'vertical-cards';
}

interface Ad {
  id: number;
  content: {
    type: 'image' | 'html';
    url?: string;
    link?: string;
    html?: string;
  };
  slot: string;
}

const AdSlot = ({ slotId, className = '', variant = 'default' }: AdSlotProps) => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [activeCard, setActiveCard] = useState<null | 1 | 2>(null);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        let query = '';
        if (slotId) {
          query = `?slot=${slotId}&status=active`;
        } else if (variant === 'vertical-cards') {
           // Fetch ads for sidebar or generic
           query = `?slot=sidebar&status=active`;
        } else {
           query = `?status=active`;
        }
        
        const fetchedAds = await request(`/api/ads${query}`);
        if (Array.isArray(fetchedAds)) {
            setAds(fetchedAds);
        }
      } catch (error) {
        console.error('Failed to fetch ads', error);
      }
    };

    fetchAds();
  }, [slotId, variant]);

  const renderAdContent = (ad: Ad | undefined, placeholder: string) => {
      if (!ad) {
          return (
            <div className="text-center p-4 select-none">
                <p className="text-gray-400 text-sm font-medium">Advertisement</p>
                <p className="text-gray-300 text-xs mt-1">{placeholder}</p>
            </div>
          );
      }

      if (ad.content.type === 'image' && ad.content.url) {
          return (
              <a href={ad.content.link || '#'} target="_blank" rel="noopener noreferrer" className="w-full h-full block">
                  <img src={ad.content.url} alt="Ad" className="w-full h-full object-cover" onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }} />
              </a>
          );
      }
      
      if (ad.content.type === 'html' && ad.content.html) {
          return <div dangerouslySetInnerHTML={{ __html: ad.content.html }} className="w-full h-full" />;
      }

      // If content type is image but no url, show placeholder
      return (
        <div className="text-center p-4 select-none">
            <p className="text-gray-400 text-sm font-medium">Advertisement</p>
            <p className="text-gray-300 text-xs mt-1">No content available</p>
        </div>
      );
  };

  if (variant === 'vertical-cards') {
    const ad1 = ads[0];
    const ad2 = ads[1];

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
          {renderAdContent(ad1, 'Ad Slot 1')}
        </div>
        {/* Lower Ad Card */}
        <div
          className={`w-[245px] h-[318px] rounded-[12px] border border-t border-gray-200 bg-white overflow-hidden shadow-sm flex items-center justify-center cursor-pointer transition-transform transition-shadow duration-300 ${activeCard === 2 ? 'scale-105 shadow-2xl' : ''}`}
          onClick={() => {
            setActiveCard(2);
            setTimeout(() => setActiveCard(null), 300);
          }}
        >
           {renderAdContent(ad2, 'Ad Slot 2')}
        </div>
      </div>
    );
  }
  
  // Default single ad slot
  const ad = ads[0];
  return (
    <div 
      className={`bg-gray-100 rounded-lg flex items-center justify-center min-h-[120px] overflow-hidden ${className}`}
      data-ad-slot={slotId}
    >
      {renderAdContent(ad, slotId || 'Ad Slot')}
    </div>
  );
};

export default AdSlot;
