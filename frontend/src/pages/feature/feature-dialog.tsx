import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Copy, Download } from "lucide-react";
import type { FeatureDTOWithCheck } from "@/types/dto";
import CheckDetails from "./check-details";

interface FeatureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature: FeatureDTOWithCheck | null;
}

const prettyDate = (iso?: string | null) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString();
  } catch (e) {
    return iso as string;
  }
};

const FeatureDialog = ({ open, onOpenChange, feature }: FeatureDialogProps) => {
  const handleDownloadJSON = () => {
    if (!feature) return;
    const blob = new Blob([JSON.stringify(feature, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `feature-${feature.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyJSON = async () => {
    if (!feature) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(feature, null, 2));
      // optional: show toast
    } catch (e) {
      // ignore
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl w-[95%] max-h-[85vh]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <DialogTitle>{feature ? feature.title : "Feature"}</DialogTitle>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyJSON}
                title="Copy JSON"
              >
                <Copy className="mr-2 h-4 w-4" /> Copy
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownloadJSON}
                title="Download JSON"
              >
                <Download className="mr-2 h-4 w-4" /> Download
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex items-center text-muted-foreground text-xs">
          <div>Created: {prettyDate(feature?.created_at)}</div>
        </div>

        <div className="grid gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Description</p>
            <div className="mt-2 text-sm whitespace-pre-wrap">
              {feature?.description ?? "—"}
            </div>
          </div>

          {feature?.latest_check && (
            <CheckDetails title="Latest Check" check={feature.latest_check} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeatureDialog;
