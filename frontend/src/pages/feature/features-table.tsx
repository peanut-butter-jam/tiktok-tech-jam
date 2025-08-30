import { Button } from "@/shared/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/shared/ui/table";
import type { FeatureDTOWithCheck } from "@/types/dto";
import { Trash2 } from "lucide-react";
import FlagBadge from "./flag-badge";
import StatusBadge from "./status-badge";
import HumanReviewBadge from "./human-review-badge";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

interface FeaturesTableProps {
  features: FeatureDTOWithCheck[];
  onSelectFeature: (feature: FeatureDTOWithCheck) => void;
  onDeleteFeature: (feature: FeatureDTOWithCheck) => void;
  isLoading?: boolean;
}

const FeaturesTable = ({
  features,
  onSelectFeature,
  onDeleteFeature,
  isLoading = false,
}: FeaturesTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Flag</TableHead>
          <TableHead>Human Review</TableHead>
          <TableHead>Created Date</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading && (
          <TableRow>
            <TableCell colSpan={6} className="py-5">
              <div className="flex justify-center items-center">
                <Spinner />
              </div>
            </TableCell>
          </TableRow>
        )}
        {!isLoading &&
          features.map((feature) => (
            <TableRow key={feature.id} onClick={() => onSelectFeature(feature)}>
              <TableCell>{feature.title}</TableCell>
              <TableCell>
                {feature.latest_check?.status ? (
                  <StatusBadge status={feature.latest_check.status} />
                ) : (
                  "No Check"
                )}
              </TableCell>
              <TableCell>
                {feature.latest_check?.eval_result?.flag ? (
                  <FlagBadge flag={feature.latest_check.eval_result.flag} />
                ) : (
                  "No Result"
                )}
              </TableCell>
              <TableCell>
                {feature.latest_check?.eval_result?.require_human_review !==
                undefined ? (
                  <HumanReviewBadge
                    require_human_review={
                      feature.latest_check.eval_result.require_human_review
                    }
                  />
                ) : (
                  "No Result"
                )}
              </TableCell>
              <TableCell>{feature.created_at}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(event) => {
                    event.stopPropagation();
                    onDeleteFeature(feature);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-1 text-red-500" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default FeaturesTable;
