import { Badge } from "@/shared/ui/badge";

interface HumanReviewBadgeProps {
  require_human_review: boolean;
}

const HumanReviewBadge = ({ require_human_review }: HumanReviewBadgeProps) => {
  return (
    <Badge
      className={
        require_human_review
          ? "bg-red-100 text-red-800"
          : "bg-slate-100 text-slate-800"
      }
    >
      {require_human_review ? "REQUIRED" : "NOT REQUIRED"}
    </Badge>
  );
};

export default HumanReviewBadge;
