import type { InputHTMLAttributes } from "react";
import { cn } from "@/shared/lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export function Input({ className, label, error, ...props }: InputProps) {
  return (
    <label className="grid gap-2 text-sm text-[var(--color-foreground-muted)]">
      {label && <span className="font-medium text-[var(--color-foreground)]">{label}</span>}
      <input
        className={cn(
          "h-12 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] px-4 text-[var(--color-foreground)] outline-none transition placeholder:text-[var(--color-foreground-subtle)] focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-primary-soft)]",
          error && "border-[var(--color-danger)] focus:ring-[rgba(214,69,93,0.16)]",
          className,
        )}
        {...props}
      />
      {error && <span className="text-xs text-[var(--color-danger)]">{error}</span>}
    </label>
  );
}
