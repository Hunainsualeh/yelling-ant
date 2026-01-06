import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Badge } from "../ui/shadcn-badge"
import { Monitor, Smartphone, Tablet } from "lucide-react"
import { useState, useEffect } from "react"
import { getAds } from "../../utils/api"
import Loader from '../ui/Loader' 

// Define all available ad slots on the website
// multiAd: true means multiple ads can be active at once
// multiAd: false means only ONE ad should be active (new ad replaces old)
export const AD_SLOTS = [
  {
    id: "sidebar",
    name: "Quiz Sidebar (Vertical Cards)",
    dimensions: "245 x 296 px / 245 x 318 px",
    platforms: ["Desktop", "Tablet"],
    description: "Left and right sidebar ad slots on quiz pages. Shows 2 ads per side (4 total).",
    multiAd: true, // Can have up to 4 active ads
    maxAds: 4,
  },
  {
    id: "quiz-main",
    name: "Quiz Mid-Roll",
    dimensions: "Full Width",
    platforms: ["Desktop", "Tablet", "Mobile"],
    description: "Appears between quiz questions. Only ONE ad active at a time.",
    multiAd: false,
    maxAds: 1,
  },
  {
    id: "quiz-result",
    name: "Quiz Results Page",
    dimensions: "728 x 90 px",
    platforms: ["Desktop", "Tablet", "Mobile"],
    description: "Displayed on the quiz results page. Only ONE ad active at a time.",
    multiAd: false,
    maxAds: 1,
  },
  {
    id: "YA_QHOME_TOP_001",
    name: "Homepage Top Banner",
    dimensions: "Full Width",
    platforms: ["Desktop", "Tablet", "Mobile"],
    description: "Top takeover banner on homepage. Only ONE ad active at a time.",
    multiAd: false,
    maxAds: 1,
  },
  {
    id: "YA_QHOME_FEED_001",
    name: "Homepage Feed Ad 1",
    dimensions: "300 x 250 px",
    platforms: ["Desktop", "Tablet", "Mobile"],
    description: "First ad slot in homepage feed. Only ONE ad active at a time.",
    multiAd: false,
    maxAds: 1,
  },
  {
    id: "YA_QHOME_FEED_002",
    name: "Homepage Feed Ad 2",
    dimensions: "300 x 250 px",
    platforms: ["Desktop", "Tablet", "Mobile"],
    description: "Second ad slot in homepage feed. Only ONE ad active at a time.",
    multiAd: false,
    maxAds: 1,
  },
  {
    id: "YA_QHOME_FEED_003",
    name: "Footer Banner",
    dimensions: "Full Width x 266 px",
    platforms: ["Desktop", "Tablet", "Mobile"],
    description: "Bottom footer ad on all pages. Only ONE ad active at a time.",
    multiAd: false,
    maxAds: 1,
  },
];

interface SlotWithStats {
  id: string;
  name: string;
  dimensions: string;
  platforms: string[];
  description: string;
  activeAds: number;
  fillRate: string;
  status: string;
}

export function SlotsTable() {
  const [slotsWithStats, setSlotsWithStats] = useState<SlotWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const ads = await getAds();
        
        // Calculate stats for each slot
        const slots = AD_SLOTS.map(slot => {
          const slotAds = Array.isArray(ads) 
            ? ads.filter((ad: any) => ad.slot === slot.id && ad.status === 'active')
            : [];
          
          return {
            ...slot,
            activeAds: slotAds.length,
            fillRate: slotAds.length > 0 ? '100%' : '0%',
            status: slotAds.length > 0 ? 'In Use' : 'Available',
          };
        });
        
        setSlotsWithStats(slots);
      } catch (error) {
        console.error('Failed to fetch slot stats:', error);
        // Still show slots without stats
        setSlotsWithStats(AD_SLOTS.map(slot => ({
          ...slot,
          activeAds: 0,
          fillRate: '0%',
          status: 'Unknown',
        })));
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="p-4 text-center"><Loader message="Loading slots..." /></div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Slot Name</TableHead>
            <TableHead>Dimensions</TableHead>
            <TableHead>Supported Platforms</TableHead>
            <TableHead className="text-center">Active Ads</TableHead>
            <TableHead className="text-right">Fill Rate</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {slotsWithStats.map((slot) => (
            <TableRow key={slot.id}>
              <TableCell className="font-medium">
                <div className="flex flex-col">
                  <span>{slot.name}</span>
                  <span className="text-xs text-gray-500 font-normal font-mono">{slot.id}</span>
                </div>
              </TableCell>
              <TableCell className="font-mono text-sm">{slot.dimensions}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {slot.platforms.includes("Desktop") && <Monitor className="h-4 w-4 text-gray-500" />}
                  {slot.platforms.includes("Tablet") && <Tablet className="h-4 w-4 text-gray-500" />}
                  {slot.platforms.includes("Mobile") && <Smartphone className="h-4 w-4 text-gray-500" />}
                </div>
              </TableCell>
              <TableCell className="text-center">{slot.activeAds}</TableCell>
              <TableCell className="text-right font-mono text-sm">{slot.fillRate}</TableCell>
              <TableCell className="text-right">
                <Badge variant={slot.status === "In Use" ? "default" : "outline"}>
                  {slot.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
