import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Textarea } from "@/shared/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Check, X } from "lucide-react";
import { useState, useEffect } from "react";
import type { FlagType } from "@/types/dto";

interface ReconcileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialFlag?: FlagType;
  initialReasoning?: string;
  onReconcile: (data: { flag: FlagType; reasoning: string }) => void;
  isLoading?: boolean;
}

const ReconcileDialog = ({
  open,
  onOpenChange,
  initialFlag = "unknown",
  initialReasoning = "",
  onReconcile,
  isLoading = false,
}: ReconcileDialogProps) => {
  const [flag, setFlag] = useState<FlagType>(initialFlag);
  const [reasoning, setReasoning] = useState(initialReasoning);

  // Reset form when modal opens/closes or initial values change
  useEffect(() => {
    if (open) {
      setFlag(initialFlag);
      setReasoning(initialReasoning);
    }
  }, [open, initialFlag, initialReasoning]);

  const handleSubmit = () => {
    if (!reasoning.trim()) {
      return; // Don't submit if reasoning is empty
    }
    onReconcile({ flag, reasoning: reasoning.trim() });
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const isValid = reasoning.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Reconcile Feature Check</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="flag" className="text-sm font-medium">
              Flag
            </label>
            <Select
              value={flag}
              onValueChange={(value: FlagType) => setFlag(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select flag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <label htmlFor="reasoning" className="text-sm font-medium">
              Reasoning <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="reasoning"
              value={reasoning}
              onChange={(e) => setReasoning(e.target.value)}
              placeholder="Provide a detailed explanation for your reconciliation decision..."
              className="min-h-[120px]"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Explain why you're changing the flag or reasoning for this feature
              check.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid || isLoading}>
            <Check className="mr-2 h-4 w-4" />
            {isLoading ? "Reconciling..." : "Reconcile"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReconcileDialog;
