import React, { useEffect, useState } from 'react';
import { Sidebar } from '../components';
import { AdForm } from '../components/ads/AdForm';
import Button from '../components/ui/Button';
import { ChevronLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { getAds } from '../utils/api';
import { useToast } from '../components/ui/toast';

const CreateAd: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [adData, setAdData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const isEditing = !!id;

  useEffect(() => {
    if (id) {
      loadAdData();
    }
  }, [id]);

  const loadAdData = async () => {
    try {
      setLoading(true);
      const ads = await getAds();
      const ad = ads.find((a: any) => a.id === id);
      if (ad) {
        setAdData(ad);
      } else {
        showToast('Ad not found', 'error');
      }
    } catch (e: any) {
      console.error('Failed to load ad', e);
      showToast(e.message || 'Failed to load ad', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex">
      <Sidebar variant="admin" />
      <main className="flex-1 p-8 overflow-auto">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Link to="/admin/ads-management">
              <Button variant="ghost" className="h-10 w-10 p-0 rounded-full flex items-center justify-center">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-[32px] font-gotham font-medium">
                {isEditing ? 'Edit Ad' : 'Create New Ad'}
              </h1>
              <p className="text-gray-500">
                {isEditing 
                  ? 'Update your campaign details, assets, and targeting.'
                  : 'Configure your campaign details, assets, and targeting.'}
              </p>
            </div>
          </div>

          <div className="max-w-4xl">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Loading...</div>
              </div>
            ) : (
              <AdForm initialData={adData} isEditing={isEditing} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateAd;
