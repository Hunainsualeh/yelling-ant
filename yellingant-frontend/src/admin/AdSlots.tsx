import React from 'react';
import { Sidebar } from '../components';
import { SlotsTable } from '../components/slots/SlotsTable';
import { Alert, AlertTitle, AlertDescription } from '../components/ui/alert';
import { Info, Layers } from 'lucide-react';

const AdSlots: React.FC = () => {
  return (
    <div className="h-screen bg-[#FFFFFF] flex overflow-hidden">
      <Sidebar variant="admin" />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[32px] font-gotham font-medium">Ad Slots</h1>
            <p className="text-gray-500 mt-1">Manage and view placements where quiz ads can be displayed.</p>
          </div>
        </div>

        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-800">Read-Only View</AlertTitle>
          <AlertDescription className="text-blue-700">
            Ad slots are managed by the system administrator. You can view their details and performance here, but
            creation or modification is restricted to system-level updates.
          </AlertDescription>
        </Alert>

        <div className="rounded-xl border bg-white shadow-sm">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Layers className="h-5 w-5 text-orange-600" />
              <h2 className="text-xl font-semibold">Available Placements</h2>
            </div>
            <SlotsTable />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdSlots;

