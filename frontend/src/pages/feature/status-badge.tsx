import { Badge } from "@/shared/ui/badge";
import type { Status } from "@/types/dto";

interface StatusBadgeProps {
  status: Status;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const map: Record<Status, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
  };
  return <Badge className={map[status]}>{status.toUpperCase()}</Badge>;
};

export default StatusBadge;
