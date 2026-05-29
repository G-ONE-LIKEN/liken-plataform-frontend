import type { SelectHTMLAttributes } from "react";
import { cn } from "@/shared/lib/utils";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
};

export function Select({ className, label, children, ...props }: SelectProps) {
  return (
    <label className="grid gap-2 text-sm text-[var(--color-foreground-muted)]">
      {label && <span className="font-medium text-[var(--color-foreground)]">{label}</span>}
      <select
        className={cn(
          "h-12 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] px-4 text-[var(--color-foreground)] outline-none transition focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-primary-soft)]",
          className,
        )}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}
