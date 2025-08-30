import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Edit, Check, X, RefreshCw, AlertTriangle } from "lucide-react";
import type {
  FeatureDTOWithCheck,
  FeatureUpdateDTO,
  Mapping,
} from "@/types/dto";
import CheckDetails from "./check-details";
import ReconcileDialog from "./reconciliation-dialog";
import { useState, useEffect } from "react";
import { useReconcileFeatureCheckMutation } from "@/lib/api/feature-api/query";

interface FeatureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature: FeatureDTOWithCheck | null;
  onUpdateFeature: (
    featureId: number,
    updatedData: FeatureUpdateDTO
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
  const [editTerminologies, setEditTerminologies] = useState<Mapping[]>([]);
  const [isReconcileModalOpen, setIsReconcileModalOpen] = useState(false);

  const reconcileMutation = useReconcileFeatureCheckMutation();

  // Reset when feature changes or dialog opens
  useEffect(() => {
    if (feature) {
      setIsEditing(false);
      setEditTitle(feature.title || "");
      setEditDescription(feature.description || "");
      setEditTerminologies(feature.terminologies || []);
    }
  }, [feature]);

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
    setEditTerminologies(feature?.terminologies || []);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditTitle(feature?.title || "");
    setEditDescription(feature?.description || "");
    setEditTerminologies(feature?.terminologies || []);
  };

  const handleConfirmEdit = async () => {
    if (!feature) return;

    try {
      await onUpdateFeature(feature.id, {
        title: editTitle,
        description: editDescription,
        terminologies:
          editTerminologies.length > 0 ? editTerminologies : undefined,
      });
      setIsEditing(false);
    } catch (error) {
      // Error is handled by the mutation hook
      console.error("Update failed:", error);
    }
  };

  const handleReconcile = async (data: {
    flag: "yes" | "no" | "unknown";
    reasoning: string;
  }) => {
    if (!feature) return;

    try {
      await reconcileMutation.mutateAsync({
        featureId: feature.id,
        data,
      });
      setIsReconcileModalOpen(false);
    } catch (error) {
      console.error("Reconcile failed:", error);
    }
  };

  const handleOpenReconcileModal = () => {
    setIsReconcileModalOpen(true);
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
                    onClick={handleOpenReconcileModal}
                    title="Reconcile"
                    disabled={!feature?.latest_check?.eval_result}
                  >
                    <AlertTriangle className="mr-2 h-4 w-4" /> Reconcile
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

          <div>
            <div className="flex items-center gap-2 mb-3">
              <p
                className="text-sm text-muted-foreground border-b border-dotted border-muted-foreground cursor-help"
                title="Define abbreviations and acronyms used in this feature. These mappings help our AI understand technical terms for better compliance evaluation."
              >
                Terminologies
              </p>
            </div>
            {isEditing ? (
              <div className="space-y-3">
                {editTerminologies.map((mapping, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <div className="flex-1 max-w-[200px]">
                      <Input
                        placeholder="e.g., AI"
                        value={mapping.key}
                        onChange={(e) => {
                          const newTerminologies = [...editTerminologies];
                          newTerminologies[index] = {
                            ...mapping,
                            key: e.target.value,
                          };
                          setEditTerminologies(newTerminologies);
                        }}
                        className="text-sm"
                      />
                    </div>
                    <div className="flex-1 max-w-[300px]">
                      <Input
                        placeholder="e.g., Artificial Intelligence"
                        value={mapping.value}
                        onChange={(e) => {
                          const newTerminologies = [...editTerminologies];
                          newTerminologies[index] = {
                            ...mapping,
                            value: e.target.value,
                          };
                          setEditTerminologies(newTerminologies);
                        }}
                        className="text-sm"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newTerminologies = editTerminologies.filter(
                          (_, i) => i !== index
                        );
                        setEditTerminologies(newTerminologies);
                      }}
                      className="shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditTerminologies([
                      ...editTerminologies,
                      { key: "", value: "" },
                    ]);
                  }}
                  className="text-xs mt-2"
                >
                  + Add Terminology
                </Button>
              </div>
            ) : (
              <div>
                {feature?.terminologies && feature.terminologies.length > 0 ? (
                  <div className="space-y-2">
                    {feature.terminologies.map((mapping, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="text-sm font-medium text-left min-w-[80px] max-w-[200px] break-words">
                          {mapping.key}:
                        </div>
                        <div className="text-sm text-muted-foreground flex-1">
                          {mapping.value}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    No terminologies defined
                  </div>
                )}
              </div>
            )}
          </div>

          {feature?.latest_check && (
            <CheckDetails title="Latest Check" check={feature.latest_check} />
          )}
        </div>

        <ReconcileDialog
          open={isReconcileModalOpen}
          onOpenChange={setIsReconcileModalOpen}
          initialFlag={feature?.latest_check?.eval_result?.flag}
          initialReasoning={feature?.latest_check?.eval_result?.reasoning || ""}
          onReconcile={handleReconcile}
          isLoading={reconcileMutation.isPending}
        />
      </DialogContent>
    </Dialog>
  );
};

export default FeatureDialog;
