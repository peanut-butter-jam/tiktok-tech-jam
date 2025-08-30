import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/shared/ui/table";
import { Button } from "@/shared/ui/button";
import type { TerminologyDTO } from "@/types/dto";
import { Spinner } from "@/shared/ui/spinner";
import { Trash2 } from "lucide-react";

interface TerminologiesTableProps {
  terminologies: TerminologyDTO[];
  onSelectTerminology?: (terminology: TerminologyDTO) => void;
  onDeleteTerminology?: (terminology: TerminologyDTO) => void;
  isLoading?: boolean;
}

const TerminologiesTable = ({
  terminologies,
  onSelectTerminology,
  onDeleteTerminology,
  isLoading = false,
}: TerminologiesTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Key</TableHead>
          <TableHead>Value</TableHead>
          <TableHead>Created Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading && (
          <TableRow>
            <TableCell colSpan={4} className="py-5">
              <div className="flex justify-center items-center">
                <Spinner />
              </div>
            </TableCell>
          </TableRow>
        )}
        {!isLoading &&
          terminologies.map((terminology) => (
            <TableRow
              key={terminology.id}
              onClick={() => onSelectTerminology?.(terminology)}
              className="cursor-pointer hover:bg-muted/50"
            >
              <TableCell className="font-medium">{terminology.key}</TableCell>
              <TableCell>{terminology.value}</TableCell>
              <TableCell>
                {new Date(terminology.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(event) => {
                    event.stopPropagation();
                    onDeleteTerminology?.(terminology);
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

export default TerminologiesTable;
