import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

// Badge Variants
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// Badge Component
interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

// StatusBadge Component
interface StatusBadgeProps {
  status: "compliant" | "non-compliant" | "pending";
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = {
    compliant: {
      icon: CheckCircle,
      label: "Compliant",
      className: "bg-success text-success-foreground hover:bg-success/80",
    },
    "non-compliant": {
      icon: XCircle,
      label: "Non-Compliant",
      className:
        "bg-destructive text-destructive-foreground hover:bg-destructive/80",
    },
    pending: {
      icon: Clock,
      label: "Pending Review",
      className: "bg-warning text-warning-foreground hover:bg-warning/80",
    },
  };

  const { icon: Icon, label, className: badgeClassName } = config[status];

  return (
    <Badge className={cn(badgeClassName, className)}>
      <Icon className="h-3 w-3 mr-1" />
      {label}
    </Badge>
  );
};

export { StatusBadge };
