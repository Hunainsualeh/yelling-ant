import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs"
import { Monitor, Smartphone, Tablet, RefreshCw } from "lucide-react"
import Button from "../ui/Button"
import { cn } from "../../lib/utils"

interface AdPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  ad: any
}

export function AdPreviewModal({ isOpen, onClose, ad }: AdPreviewModalProps) {
  const [viewMode, setViewMode] = useState("desktop")

  if (!ad) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Ad Preview: {ad.name}</DialogTitle>
              <DialogDescription>
                Preview how your quiz ad looks across different devices and placements.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 flex flex-col bg-gray-50 min-h-0">
          <div className="flex items-center justify-center border-y bg-white px-4 py-2">
            <Tabs value={viewMode} onValueChange={setViewMode} className="w-auto">
              <TabsList>
                <TabsTrigger value="desktop" className="gap-2">
                  <Monitor className="h-4 w-4" /> Desktop
                </TabsTrigger>
                <TabsTrigger value="tablet" className="gap-2">
                  <Tablet className="h-4 w-4" /> Tablet
                </TabsTrigger>
                <TabsTrigger value="mobile" className="gap-2">
                  <Smartphone className="h-4 w-4" /> Mobile
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="ml-auto flex gap-2">
              <Button variant="outline" className="p-2 h-auto">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-8 flex items-start justify-center">
            <div
              className={cn(
                "bg-white border shadow-2xl transition-all duration-300 rounded-lg overflow-hidden relative",
                viewMode === "desktop" && "w-full max-w-[800px] h-[500px]",
                viewMode === "tablet" && "w-[600px] h-[800px]",
                viewMode === "mobile" && "w-[375px] h-[667px]",
              )}
            >
              {/* Ad content placeholder */}
              <div className="absolute inset-0 flex flex-col">
                <div className="relative h-2/5 bg-orange-50">
                  <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 opacity-50" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/90 p-4 rounded-full shadow-lg">
                      <div className="w-12 h-12 flex items-center justify-center font-bold text-orange-600 text-xl">
                        {ad.brand.substring(0, 2).toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 p-6 flex flex-col items-center text-center space-y-4">
                  <h3 className="text-xl font-bold text-gray-900">{ad.name}</h3>
                  <p className="text-gray-500 text-sm max-w-[80%]">
                    Ready to see how you match up with {ad.brand}? Take our quick 2-minute quiz!
                  </p>

                  <div className="grid grid-cols-1 gap-2 w-full max-w-[300px] mt-4">
                    <Button variant="outline" className="justify-start bg-transparent w-full">
                      A. Option One
                    </Button>
                    <Button variant="outline" className="justify-start bg-transparent w-full">
                      B. Option Two
                    </Button>
                    <Button variant="outline" className="justify-start bg-transparent w-full">
                      C. Option Three
                    </Button>
                  </div>

                  <div className="mt-auto pt-6 text-[10px] text-gray-400 uppercase tracking-widest">
                    Sponsored by {ad.brand}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t bg-white flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Close Preview
          </Button>
          <Button>Edit Campaign</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
