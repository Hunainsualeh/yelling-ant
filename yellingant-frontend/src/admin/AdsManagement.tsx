import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components';
import { AdsStats } from '../components/ads/AdsStats';
import { AdsTable } from '../components/ads/AdsTable';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { request } from '../utils/api';

// Create New Ad Button (matching the Create New Quiz button style)
const CreateNewAdButton: React.FC = () => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate('/admin/ads/new')}
      className="flex items-center gap-2 px-6 py-3 bg-[#C85103] hover:bg-[#a84400] text-white font-helvetica font-medium text-[14px] rounded-lg transition-colors"
      type="button"
    >
      <Plus className="w-5 h-5" />
      Create New Ad
    </button>
  );
};

const AdsManagement: React.FC = () => {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [slotFilter, setSlotFilter] = useState<string>('all');

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const data = await request('/api/ads');
        if (Array.isArray(data)) {
          setAds(data);
        }
      } catch (e) {
        console.error('Failed to fetch ads', e);
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, []);

  // Get unique slots for filter dropdown
  const uniqueSlots = [...new Set(ads.map(ad => ad.slot).filter(Boolean))];

  // Filter ads based on search and filters
  const filteredAds = ads.filter((ad) => {
    const matchesSearch = 
      (ad.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ad.brand || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ad.status === statusFilter;
    const matchesSlot = slotFilter === 'all' || ad.slot === slotFilter;
    return matchesSearch && matchesStatus && matchesSlot;
  });

  return (
    <div className="h-screen bg-[#FFFFFF] flex overflow-hidden">
      <Sidebar variant="admin" />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[32px] font-gotham font-medium">Ads Management</h1>
            <p className="text-gray-500 mt-1">Create, monitor, and optimize your quiz ad campaigns.</p>
          </div>
          <CreateNewAdButton />
        </div>

        <div className="mb-8">
          <AdsStats ads={ads} />
        </div>

        <div className="rounded-xl border bg-white shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Active & Scheduled Ads</h2>
            <AdsTable 
              ads={filteredAds} 
              loading={loading}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              slotFilter={slotFilter}
              onSlotFilterChange={setSlotFilter}
              uniqueSlots={uniqueSlots}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdsManagement;

