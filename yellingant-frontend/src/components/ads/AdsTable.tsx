import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Badge } from "../ui/shadcn-badge"
import Button from "../ui/Button"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { MoreHorizontal, Search, ExternalLink, Edit, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { AdPreviewModal } from "./AdPreviewModal"
import { request } from "../../utils/api"
import { ConfirmDialog } from "../ui/ConfirmDialog"
import { Alert, AlertTitle, AlertDescription } from "../ui/alert"
import Loader from '../ui/Loader'
import { useState } from "react"

interface AdsTableProps {
  ads: any[];
  loading?: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  slotFilter: string;
  onSlotFilterChange: (value: string) => void;
  uniqueSlots: string[];
}

export function AdsTable({ 
  ads, 
  loading = false,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  slotFilter,
  onSlotFilterChange,
  uniqueSlots
}: AdsTableProps) {
  const [previewAd, setPreviewAd] = useState<any | null>(null)
  const [deleteAdId, setDeleteAdId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const confirmDelete = (adId: number) => {
    setDeleteAdId(adId)
  };

  const performDelete = async () => {
    if (!deleteAdId) return;
    setIsDeleting(true)
    setError(null)
    try {
      await request(`/api/ads/${deleteAdId}`, { method: 'DELETE' });
      window.location.reload();
    } catch (e: any) {
      console.error('Failed to delete ad', e);
      setError('Failed to delete ad: ' + (e?.message || 'Unknown error'));
    } finally {
      setIsDeleting(false)
      setDeleteAdId(null)
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search ads or brands..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
          </SelectContent>
        </Select>

        <Select value={slotFilter} onValueChange={onSlotFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Ad Slot" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Slots</SelectItem>
            {uniqueSlots.map((slot) => (
              <SelectItem key={slot} value={slot}>{slot}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {(statusFilter !== 'all' || slotFilter !== 'all' || searchTerm) && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              onSearchChange('');
              onStatusFilterChange('all');
              onSlotFilterChange('all');
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ad Name</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ad Slot</TableHead>
              <TableHead className="text-right">Impressions</TableHead>
              <TableHead className="text-right">CTR</TableHead>
              <TableHead className="w-[70px]"><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-8"><Loader message="Loading ads..." /></td>
              </tr>
            ) : ads.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">No ads found</td>
              </tr>
            ) : (
              ads.map((ad) => (
                <TableRow key={ad.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{ad.name}</span>
                      <span className="text-xs text-gray-500 font-normal">{ad.id}</span>
                    </div>
                  </TableCell>
                  <TableCell>{ad.brand}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        ad.status === "active" ? "default" : ad.status === "scheduled" ? "secondary" : "outline"
                      }
                      className={
                        ad.status === "active"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : ad.status === "scheduled"
                            ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                            : "text-gray-500"
                      }
                    >
                      {ad.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{ad.slot}</TableCell>
                  <TableCell className="text-right">{ad.impressions?.toLocaleString() || 0}</TableCell>
                  <TableCell className="text-right">{ad.ctr || 0}%</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => setPreviewAd(ad)}>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => confirmDelete(ad.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Ad
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {previewAd && (
        <AdPreviewModal ad={previewAd} isOpen={!!previewAd} onClose={() => setPreviewAd(null)} />
      )}

      {error && (
        <div className="mt-4">
          <Alert className="bg-red-50 border-red-200">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      <ConfirmDialog
        open={deleteAdId !== null}
        onOpenChange={(v) => { if (!v) setDeleteAdId(null) }}
        onConfirm={performDelete}
        title="Delete ad?"
        description="Are you sure you want to delete this ad? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />
    </div>
  )
}

