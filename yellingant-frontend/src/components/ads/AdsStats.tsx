import { useEffect, useState } from "react"
import StatsCard from "../ui/StatsCard"
import { request } from "../../utils/api"

interface AdsStatsProps {
  ads?: any[];
}

export function AdsStats({ ads: propAds }: AdsStatsProps) {
  const [stats, setStats] = useState({
    totalAds: 0,
    totalImpressions: 0,
    avgCtr: 0,
    activeNow: 0,
    activeSlots: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const calculateStats = async () => {
      try {
        let ads = propAds;
        if (!ads) {
          const data = await request('/api/ads');
          ads = Array.isArray(data) ? data : [];
        }
        
        const totalImpressions = ads.reduce((sum: number, ad: any) => sum + (ad.impressions || 0), 0);
        const totalClicks = ads.reduce((sum: number, ad: any) => sum + (ad.clicks || 0), 0);
        const avgCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(1) : '0';
        const activeAds = ads.filter((ad: any) => ad.status === 'active');
        const uniqueSlots = new Set(activeAds.map((ad: any) => ad.slot)).size;

        setStats({
          totalAds: ads.length,
          totalImpressions,
          avgCtr: parseFloat(avgCtr),
          activeNow: activeAds.length,
          activeSlots: uniqueSlots
        });
      } catch (e) {
        console.error("Failed to calculate stats", e);
      } finally {
        setLoading(false);
      }
    };
    calculateStats();
  }, [propAds]);

  const formatImpressions = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Ads"
        value={loading ? '...' : stats.totalAds.toString()}
        delta="0%"
        deltaType="neutral"
        subtitle="All campaigns"
        icon={<img src="/openbook.svg" alt="ads" className="w-[52px] h-[52px]" />}
        iconBgColor="bg-white"
      />
      <StatsCard
        title="Total Impressions"
        value={loading ? '...' : formatImpressions(stats.totalImpressions)}
        delta="0%"
        deltaType="neutral"
        subtitle="All time"
        icon={
          <div className="relative w-[52px] h-[52px]">
            <img src="/increamentgraph.svg" alt="graph" className="w-[52px] h-[52px]" />
            <img src="/iconincreamentinner.svg" alt="inner" className="absolute left-1/2 top-3 transform -translate-x-1/2 w-[24px] h-[24px]" />
          </div>
        }
        iconBgColor="bg-white"
      />
      <StatsCard
        title="Avg. CTR"
        value={loading ? '...' : `${stats.avgCtr}%`}
        delta="0%"
        deltaType="neutral"
        subtitle="Click-through rate"
        icon={<img src="/pause.svg" alt="ctr" className="w-[52px] h-[52px]" />}
        iconBgColor="bg-white"
      />
      <StatsCard
        title="Active Now"
        value={loading ? '...' : stats.activeNow.toString()}
        delta={`Across ${stats.activeSlots} slots`}
        deltaType="neutral"
        subtitle=""
        icon={<img src="/timer.svg" alt="active" className="w-[52px] h-[52px]" />}
        iconBgColor="bg-white"
      />
    </div>
  )
}
