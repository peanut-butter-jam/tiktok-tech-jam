import { Badge } from "@/shared/ui/badge";
import type { FlagType } from "@/types/dto";

interface FlagBadgeProps {
  flag: FlagType;
}

const FlagBadge = ({ flag }: FlagBadgeProps) => {
  const map: Record<FlagType, string> = {
    yes: "bg-green-100 text-green-800",
    no: "bg-slate-100 text-slate-800",
    unknown: "bg-yellow-100 text-yellow-800",
  };
  return <Badge className={map[flag]}>{flag.toUpperCase()}</Badge>;
};

export default FlagBadge;
