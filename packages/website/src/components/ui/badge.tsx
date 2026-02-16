import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "outline" | "accent";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        variant === "default" && "bg-surface border border-border text-foreground",
        variant === "outline" && "border border-border text-muted",
        variant === "accent" && "bg-accent/10 text-accent border border-accent/20",
        className
      )}
      {...props}
    />
  );
}
