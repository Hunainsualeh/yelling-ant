import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Badge } from "../ui/shadcn-badge"
import { Monitor, Smartphone, Tablet } from "lucide-react"

const MOCK_SLOTS = [
  {
    id: "SLOT-001",
    name: "Homepage Sidebar",
    dimensions: "300 x 600 px",
    platforms: ["Desktop", "Tablet"],
    activeAds: 2,
    fillRate: "94%",
    status: "In Use",
  },
  {
    id: "SLOT-002",
    name: "Article Mid-roll",
    dimensions: "Responsive",
    platforms: ["Desktop", "Tablet", "Mobile"],
    activeAds: 1,
    fillRate: "88%",
    status: "In Use",
  },
  {
    id: "SLOT-003",
    name: "Quiz Results Page",
    dimensions: "728 x 90 px",
    platforms: ["Desktop"],
    activeAds: 1,
    fillRate: "100%",
    status: "In Use",
  },
  {
    id: "SLOT-004",
    name: "Footer Banner",
    dimensions: "Full Width",
    platforms: ["Mobile"],
    activeAds: 0,
    fillRate: "0%",
    status: "Available",
  },
]

export function SlotsTable() {
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
          {MOCK_SLOTS.map((slot) => (
            <TableRow key={slot.id}>
              <TableCell className="font-medium">
                <div className="flex flex-col">
                  <span>{slot.name}</span>
                  <span className="text-xs text-gray-500 font-normal">{slot.id}</span>
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
