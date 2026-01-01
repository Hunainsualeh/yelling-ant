import { useState, useEffect } from 'react';
import { request } from '../../utils/api';

interface AdSlotProps {
  slotId?: string;
  className?: string;
  variant?: 'default' | 'vertical-cards' | 'quiz-banner';
  position?: 'left' | 'right'; // For vertical-cards, determines which ads to show
}

interface Ad {
  id: number;
  name?: string;
  content: {
    type: 'image' | 'html';
    url?: string;
    link?: string;
    html?: string;
  };
  slot: string;
}

// AD Badge component - positioned top right
const AdBadge = () => (
  <div className="absolute top-2 right-2 z-20 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
    <span className="text-white text-[10px] font-bold tracking-wider">AD</span>
  </div>
);

// Global cache to share ads between left/right sidebars
// Cache expires after 30 seconds to allow new ads to be fetched
let sidebarAdsCache: Ad[] | null = null;
let sidebarAdsFetchPromise: Promise<Ad[]> | null = null;
let sidebarCacheTime: number = 0;
const CACHE_DURATION = 30000; // 30 seconds

const clearSidebarCache = () => {
  sidebarAdsCache = null;
  sidebarAdsFetchPromise = null;
  sidebarCacheTime = 0;
};

const AdSlot = ({ slotId, className = '', variant = 'default', position }: AdSlotProps) => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [activeCard, setActiveCard] = useState<null | 1 | 2>(null);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchAds = async () => {
      try {
        // For vertical-cards, use shared cache to avoid duplicate fetches
        if (variant === 'vertical-cards') {
          const now = Date.now();
          
          // Check if cache is still valid
          if (sidebarAdsCache && (now - sidebarCacheTime) < CACHE_DURATION) {
            console.log('[AdSlot] Using cached sidebar ads');
            setAds(sidebarAdsCache);
            return;
          }
          
          // Clear expired cache
          if (sidebarAdsCache && (now - sidebarCacheTime) >= CACHE_DURATION) {
            clearSidebarCache();
          }
          
          if (!sidebarAdsFetchPromise) {
            sidebarAdsFetchPromise = request('/api/ads?slot=sidebar&status=active').then(data => {
              if (Array.isArray(data)) {
                sidebarAdsCache = data;
                sidebarCacheTime = Date.now();
                console.log('[AdSlot] Cached sidebar ads:', data.length);
                return data;
              }
              return [];
            }).catch(err => {
              console.error('[AdSlot] Failed to fetch sidebar ads:', err);
              sidebarAdsFetchPromise = null;
              return [];
            });
          }
          
          const cachedAds = await sidebarAdsFetchPromise;
          setAds(cachedAds);
          return;
        }

        // For other slots, fetch normally
        let query = '';
        if (slotId) {
          query = `?slot=${slotId}&status=active`;
        } else {
          query = `?status=active`;
        }
        
        console.log('[AdSlot] Fetching ads with query:', query);
        const fetchedAds = await request(`/api/ads${query}`);
        console.log('[AdSlot] Fetched ads:', fetchedAds);
        if (Array.isArray(fetchedAds)) {
          setAds(fetchedAds);
        }
      } catch (error) {
        console.error('[AdSlot] Failed to fetch ads', error);
      }
    };

    fetchAds();
  }, [slotId, variant]);

  const renderAdContent = (ad: Ad | undefined, placeholder: string) => {
      if (!ad) {
          return (
            <div className="text-center p-4 select-none relative">
                <p className="text-gray-400 text-sm font-medium">Advertisement</p>
                <p className="text-gray-300 text-xs mt-1">{placeholder}</p>
            </div>
          );
      }

      const hasImageError = imageErrors.has(ad.id);

      if (ad.content.type === 'image' && ad.content.url && !hasImageError) {
          return (
              <div className="relative w-full h-full">
                  <AdBadge />
                  <a href={ad.content.link || '#'} target="_blank" rel="noopener noreferrer" className="w-full h-full block">
                      <img 
                        src={ad.content.url} 
                        alt={ad.name || 'Ad'} 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                          console.error('[AdSlot] Image failed to load:', ad.content.url);
                          setImageErrors(prev => new Set(prev).add(ad.id));
                          e.currentTarget.style.display = 'none';
                        }}
                        onLoad={() => {
                          console.log('[AdSlot] Image loaded successfully:', ad.content.url);
                        }}
                      />
                  </a>
              </div>
          );
      }
      
      if (ad.content.type === 'html' && ad.content.html) {
          return (
            <div className="relative w-full h-full">
              <AdBadge />
              <div dangerouslySetInnerHTML={{ __html: ad.content.html }} className="w-full h-full" />
            </div>
          );
      }

      // If image failed to load or no URL, show placeholder with ad name
      return (
        <div className="relative text-center p-4 select-none flex flex-col items-center justify-center h-full bg-gradient-to-br from-purple-100 to-indigo-100">
            <AdBadge />
            <p className="text-gray-600 text-sm font-medium">{ad.name || 'Advertisement'}</p>
            {ad.content.link && (
              <a href={ad.content.link} target="_blank" rel="noopener noreferrer" className="text-purple-600 text-xs mt-2 hover:underline">
                Visit →
              </a>
            )}
        </div>
      );
  };

  if (variant === 'vertical-cards') {
    // For left sidebar: show ads[0] and ads[1]
    // For right sidebar: show ads[2] and ads[3]
    const startIndex = position === 'right' ? 2 : 0;
    const ad1 = ads[startIndex];
    const ad2 = ads[startIndex + 1];

    console.log(`[AdSlot] vertical-cards position=${position}, showing ads at index ${startIndex} and ${startIndex + 1}`, { ad1: ad1?.name, ad2: ad2?.name });

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
  
  // Quiz Banner variant - 798px x 147px
  if (variant === 'quiz-banner' || slotId === 'quiz-main') {
    const ad = ads[0];
    return (
      <div 
        className={`w-full max-w-[798px] h-[147px] mx-auto rounded-t-[4px] border border-[#B3B6B6] bg-white overflow-hidden relative ${className}`}
        data-ad-slot={slotId || 'quiz-main'}
      >
        {renderAdContent(ad, 'Quiz Ad')}
      </div>
    );
  }
  
  // Default single ad slot
  const ad = ads[0];
  return (
    <div 
      className={`bg-gray-100 rounded-lg flex items-center justify-center min-h-[120px] overflow-hidden relative ${className}`}
      data-ad-slot={slotId}
    >
      {renderAdContent(ad, slotId || 'Ad Slot')}
    </div>
  );
};

export default AdSlot;
