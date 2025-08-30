import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Copy, Download, Edit, Check, X, RefreshCw } from "lucide-react";
import type { FeatureDTOWithCheck, FeatureCreateDTO } from "@/types/dto";
import CheckDetails from "./check-details";
import { useState, useEffect } from "react";

interface FeatureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature: FeatureDTOWithCheck | null;
  onUpdateFeature: (
    featureId: number,
    updatedData: FeatureCreateDTO
  ) => Promise<void>;
  onTriggerFeatureCheck: (feature: FeatureDTOWithCheck) => void;
}

const prettyDate = (iso?: string | null) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString();
  } catch (e) {
    return iso as string;
  }
};

const FeatureDialog = ({
  open,
  onOpenChange,
  feature,
  onUpdateFeature,
  onTriggerFeatureCheck,
}: FeatureDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Reset when feature changes or dialog opens
  useEffect(() => {
    if (feature) {
      setIsEditing(false);
      setEditTitle(feature.title || "");
      setEditDescription(feature.description || "");
    }
  }, [feature]);
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

  const handleTriggerFeatureCheck = async () => {
    if (!feature) return;

    try {
      await onTriggerFeatureCheck(feature);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to trigger feature check:", error);
    }
  };

  const handleStartEdit = () => {
    setIsEditing(true);
    setEditTitle(feature?.title || "");
    setEditDescription(feature?.description || "");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditTitle(feature?.title || "");
    setEditDescription(feature?.description || "");
  };

  const handleConfirmEdit = async () => {
    if (!feature) return;

    try {
      await onUpdateFeature(feature.id, {
        title: editTitle,
        description: editDescription,
      });
      setIsEditing(false);
    } catch (error) {
      // Error is handled by the mutation hook
      console.error("Update failed:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl w-[95%] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {isEditing ? (
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="text-lg font-semibold"
                placeholder="Feature title"
              />
            ) : (
              <DialogTitle>{feature ? feature.title : "Feature"}</DialogTitle>
            )}

            <div className="flex items-center gap-1">
              {isEditing ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleConfirmEdit}
                    title="Confirm changes"
                  >
                    <Check className="mr-2 h-4 w-4" /> Confirm
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancelEdit}
                    title="Cancel editing"
                  >
                    <X className="mr-2 h-4 w-4" /> Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleTriggerFeatureCheck}
                    title="Rerun feature check"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" /> Rerun Check
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleStartEdit}
                    title="Edit feature"
                  >
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </Button>
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
                </>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="flex items-center text-muted-foreground text-xs">
          <div>Created: {prettyDate(feature?.created_at)}</div>
        </div>

        <div className="grid gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Description</p>
            {isEditing ? (
              <Textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="mt-2 text-sm min-h-[100px]"
                placeholder="Feature description"
              />
            ) : (
              <div className="mt-2 text-sm whitespace-pre-wrap">
                {feature?.description ?? "—"}
              </div>
            )}
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
