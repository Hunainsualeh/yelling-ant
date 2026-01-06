import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components';
import { AdsStats } from '../components/ads/AdsStats';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAds, deleteAd, updateAd, bulkDeleteAds } from '../utils/api';
import { useToast } from '../components/ui/toast';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { AdPreviewModal } from '../components/ads/AdPreviewModal';

// Create New Ad Button
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

interface Ad {
  id: string;
  name: string;
  brand: string;
  status: string;
  slot: string;
  content: any;
  impressions?: number;
  clicks?: number;
  created_at?: string;
}

const AdsManagement: React.FC = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [slotFilter, setSlotFilter] = useState<string>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [previewAd, setPreviewAd] = useState<Ad | null>(null);
  const [, setActionLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  const navigate = useNavigate();
  const { showToast } = useToast();

  const fetchAds = async () => {
    try {
      setLoading(true);
      const data = await getAds();
      if (Array.isArray(data)) {
        setAds(data);
      }
    } catch (e: any) {
      console.error('Failed to fetch ads', e);
      showToast(e.message || 'Failed to load ads', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleDelete = async () => {
    if (!selectedAd) return;
    
    try {
      setActionLoading(true);
      await deleteAd(selectedAd.id);
      showToast('Ad deleted successfully', 'success');
      setAds(ads.filter(a => a.id !== selectedAd.id));
      setSelectedAd(null);
    } catch (e: any) {
      console.error('Failed to delete ad', e);
      showToast(e.message || 'Failed to delete ad', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!selectedAd) return;
    
    try {
      setActionLoading(true);
      const newStatus = selectedAd.status === 'active' ? 'inactive' : 'active';
      await updateAd(selectedAd.id, { ...selectedAd, status: newStatus });
      
      showToast(
        newStatus === 'active' ? 'Ad activated successfully' : 'Ad deactivated successfully',
        'success'
      );
      
      setAds(ads.map(a => 
        a.id === selectedAd.id 
          ? { ...a, status: newStatus }
          : a
      ));
      setSelectedAd(null);
    } catch (e: any) {
      console.error('Failed to toggle ad status', e);
      showToast(e.message || 'Failed to update ad status', 'error');
    } finally {
      setActionLoading(false);
    }
  };

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

  const activeCount = ads.filter(a => a.status === 'active').length;
  const inactiveCount = ads.filter(a => a.status === 'inactive').length;

  return (
    <div className="h-screen bg-[#FFFFFF] flex overflow-hidden">
      <Sidebar variant="admin" />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[32px] font-gotham font-medium">Ads Management</h1>
            <p className="text-gray-500 mt-1">
              {activeCount} active • {inactiveCount} inactive
            </p>
          </div>
          <CreateNewAdButton />
        </div>

        <div className="mb-8">
          <AdsStats ads={ads} />
        </div>

        {/* Filters */}
        <div className="rounded-xl border bg-white shadow-sm mb-6 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or brand..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C85103] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C85103] focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slot
              </label>
              <select
                value={slotFilter}
                onChange={(e) => setSlotFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C85103] focus:border-transparent"
              >
                <option value="all">All Slots</option>
                {uniqueSlots.map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Ads Table */}
        <div className="rounded-xl border bg-white shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Active & Scheduled Ads</h2>
            
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Loading ads...</div>
              </div>
            ) : filteredAds.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <p>No ads found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 text-left">
                      <th className="pb-3 text-sm font-medium text-gray-500">Ad Name</th>
                      <th className="pb-3 text-sm font-medium text-gray-500">Brand</th>
                      <th className="pb-3 text-sm font-medium text-gray-500">Slot</th>
                      <th className="pb-3 text-sm font-medium text-gray-500">Status</th>
                      <th className="pb-3 text-sm font-medium text-gray-500">Impressions</th>
                      <th className="pb-3 text-sm font-medium text-gray-500 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAds.map((ad) => (
                      <tr key={ad.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 text-sm font-medium">
                          <input
                            type="checkbox"
                            className="mr-3"
                            checked={selectedIds.includes(Number(ad.id))}
                            onChange={(e) => {
                              const idNum = Number(ad.id);
                              setSelectedIds(prev => e.target.checked ? [...prev, idNum] : prev.filter(x => x !== idNum));
                            }}
                          />
                          {ad.name}
                        </td>
                        <td className="py-4 text-sm text-gray-600">{ad.brand}</td>
                        <td className="py-4 text-sm text-gray-600">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                            {ad.slot}
                          </span>
                        </td>
                        <td className="py-4 text-sm">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            ad.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {ad.status}
                          </span>
                        </td>
                        <td className="py-4 text-sm text-gray-600">
                          {ad.impressions?.toLocaleString() || '0'}
                        </td>
                        <td className="py-4 text-sm text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Preview */}
                            <button
                              onClick={() => setPreviewAd(ad)}
                              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Preview Ad"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* Edit */}
                            <button
                              onClick={() => navigate(`/admin/ads/edit/${ad.id}`)}
                              className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit Ad"
                            >
                              <Edit className="w-4 h-4" />
                            </button>

                            {/* Toggle Status */}
                            <button
                              onClick={() => {
                                setSelectedAd(ad);
                                setStatusDialogOpen(true);
                              }}
                              className={`p-2 rounded-lg transition-colors ${
                                ad.status === 'active'
                                  ? 'text-amber-600 hover:text-amber-900 hover:bg-amber-50'
                                  : 'text-green-600 hover:text-green-900 hover:bg-green-50'
                              }`}
                              title={ad.status === 'active' ? 'Deactivate Ad' : 'Activate Ad'}
                            >
                              {ad.status === 'active' ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => {
                                setSelectedAd(ad);
                                setDeleteDialogOpen(true);
                              }}
                              className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Ad"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Bulk delete button and confirm dialog */}
      <div className="fixed bottom-6 right-6">
        <button
          disabled={selectedIds.length === 0}
          onClick={() => setBulkDeleteDialogOpen(true)}
          className={`px-4 py-2 rounded-lg text-white ${selectedIds.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
        >
          Delete Selected ({selectedIds.length})
        </button>
      </div>

      {/* Preview Modal */}
      <AdPreviewModal
        ad={previewAd}
        isOpen={!!previewAd}
        onClose={() => setPreviewAd(null)}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Ad"
        description={`Are you sure you want to delete "${selectedAd?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />

      {/* Bulk Delete Confirmation Dialog */}
      <ConfirmDialog
        open={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}
        onConfirm={async () => {
          try {
            const token = localStorage.getItem('admin_token') || undefined;
            await bulkDeleteAds(selectedIds, token);
            showToast('Selected ads deleted', 'success');
            setAds(ads.filter(a => !selectedIds.includes(Number(a.id))));
            setSelectedIds([]);
          } catch (e: any) {
            console.error('Bulk delete failed', e);
            showToast(e.message || 'Bulk delete failed', 'error');
          } finally {
            setBulkDeleteDialogOpen(false);
          }
        }}
        title="Delete selected ads"
        description={`Are you sure you want to delete ${selectedIds.length} selected ad(s)? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />

      {/* Status Toggle Confirmation Dialog */}
      <ConfirmDialog
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        onConfirm={handleToggleStatus}
        title={selectedAd?.status === 'active' ? 'Deactivate Ad' : 'Activate Ad'}
        description={
          selectedAd?.status === 'active'
            ? `Are you sure you want to deactivate "${selectedAd?.name}"? It will no longer be shown on the website.`
            : `Are you sure you want to activate "${selectedAd?.name}"? It will start being shown on the website.`
        }
        confirmText={selectedAd?.status === 'active' ? 'Deactivate' : 'Activate'}
        type={selectedAd?.status === 'active' ? 'warning' : 'info'}
      />
    </div>
  );
};

export default AdsManagement;
