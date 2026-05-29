import type { HTMLAttributes } from "react";
import { cn } from "@/shared/lib/utils";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: "neutral" | "success" | "warning" | "danger" | "brand";
};

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]",
        tone === "neutral" && "bg-[var(--color-surface-strong)] text-[var(--color-foreground-muted)]",
        tone === "success" && "bg-[rgba(65,148,120,0.16)] text-[var(--color-success)]",
        tone === "warning" && "bg-[rgba(214,160,79,0.18)] text-[var(--color-warning)]",
        tone === "danger" && "bg-[rgba(225,89,104,0.16)] text-[var(--color-danger)]",
        tone === "brand" && "bg-[rgba(31,132,140,0.16)] text-[var(--color-primary-strong)]",
        className,
      )}
      {...props}
    />
  );
}
