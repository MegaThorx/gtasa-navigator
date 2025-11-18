import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CoordinatePicker({
  origin,
  destination,
  onSetOriginClick,
  onSetDestinationClick,
}: {
  origin: { x: number; y: number } | null;
  destination: { x: number; y: number } | null;
  onSetOriginClick: () => void;
  onSetDestinationClick: () => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-slate-300 mb-2 block text-sm font-semibold">
          Origin
        </Label>
        <div className="flex gap-2">
          <Input
            value={origin ? `${origin.x}, ${origin.y}` : ""}
            placeholder="Click map or select..."
            readOnly
            className="bg-slate-800/50 border-slate-700 text-slate-200 flex-1"
          />
          <Button
            onClick={onSetOriginClick}
            size="icon"
            className="bg-green-600 hover:bg-green-700 shrink-0"
          >
            <MapPin className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div>
        <Label className="text-slate-300 mb-2 block text-sm font-semibold">
          Destination
        </Label>
        <div className="flex gap-2">
          <Input
            value={destination ? `${destination.x}, ${destination.y}` : ""}
            placeholder="Click map or select..."
            readOnly
            className="bg-slate-800/50 border-slate-700 text-slate-200 flex-1"
          />
          <Button
            onClick={onSetDestinationClick}
            size="icon"
            className="bg-red-600 hover:bg-red-700 shrink-0"
          >
            <MapPin className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
