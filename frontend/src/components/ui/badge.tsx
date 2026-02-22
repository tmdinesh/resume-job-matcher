import * as React from "react";
import { cn } from "../../utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info";
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
          {
            "bg-primary/10 text-primary border border-primary/20": variant === "default",
            "bg-green-500/10 text-green-700 border border-green-500/20": variant === "success",
            "bg-yellow-500/10 text-yellow-700 border border-yellow-500/20": variant === "warning",
            "bg-red-500/10 text-red-700 border border-red-500/20": variant === "danger",
            "bg-muted text-muted-foreground border border-border": variant === "info",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

export { Badge };
