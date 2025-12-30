import React from 'react';
import { Sidebar } from '../components';
import { AdForm } from '../components/ads/AdForm';
import Button from '../components/ui/Button';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const CreateAd: React.FC = () => {
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
              <h1 className="text-[32px] font-gotham font-medium">Create New Ad</h1>
              <p className="text-gray-500">Configure your campaign details, assets, and targeting.</p>
            </div>
          </div>

          <div className="max-w-4xl">
            <AdForm />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateAd;
