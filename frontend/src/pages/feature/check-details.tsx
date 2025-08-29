import { Card, CardContent } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import type { CheckDTO } from "@/types/dto";
import FlagBadge from "./flag-badge";
import StatusBadge from "./status-badge";
import HumanReviewBadge from "./human-review-badge";

interface CheckDetailsProps {
  title: string;
  check: CheckDTO;
}

const prettyDate = (iso?: string | null) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString();
  } catch (e) {
    return iso as string;
  }
};

const CheckDetails = ({ title, check }: CheckDetailsProps) => {
  const { eval_result, status } = check;
  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-3">
        <p className="text-sm text-muted-foreground">{`${title}`}</p>
        <StatusBadge status={check.status} />
        <div className="text-xs text-muted-foreground">
          {check ? `Triggered: ${prettyDate(check.created_at)}` : null}
        </div>
      </div>
      <Card>
        <CardContent className="grid gap-4">
          {/* Row 2: flag, confidence & require human review (badges) */}
          {status === "completed" && eval_result && (
            <>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="text-xs text-slate-500">Flag</div>
                  <FlagBadge flag={eval_result.flag} />
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-xs text-slate-500">Confidence</div>
                  <Badge className="bg-slate-100 text-slate-800">
                    {(eval_result.confidence * 100).toFixed(1)}%
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-xs text-slate-500">Human review</div>
                  <HumanReviewBadge
                    require_human_review={eval_result.require_human_review}
                  />
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Reasoning</div>
                <div className="mt-1 text-sm text-slate-700 whitespace-pre-wrap">
                  {eval_result.reasoning}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Suggested Actions</div>
                {eval_result.recommended_actions &&
                eval_result.recommended_actions.length ? (
                  <ul className="list-disc ml-5 mt-1 text-sm">
                    {eval_result.recommended_actions.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                ) : (
                  <div className="mt-1 text-sm text-slate-500">
                    No suggested actions
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckDetails;
