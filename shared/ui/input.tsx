import { useId, type InputHTMLAttributes } from "react";
import { cn } from "@/shared/lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: string;
};

export function Input({ className, label, error, hint, id, ...props }: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = error || hint ? `${inputId}-message` : undefined;

  return (
    <label className="grid min-w-0 gap-2 text-sm text-[var(--color-foreground-muted)]">
      {label && (
        <span className="font-medium text-[var(--color-foreground)]">
          {label}
        </span>
      )}
      <input
        id={inputId}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={messageId}
        className={cn(
          "h-12 w-full min-w-0 rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] px-4 text-[var(--color-foreground)] outline-none transition placeholder:text-[var(--color-foreground-subtle)] focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-primary-soft)]",
          error && "border-[var(--color-danger)] focus:ring-[rgba(214,69,93,0.16)]",
          className,
        )}
        {...props}
      />
      {(error || hint) && (
        <span
          id={messageId}
          className={cn(
            "text-xs",
            error ? "text-[var(--color-danger)]" : "text-[var(--color-foreground-subtle)]",
          )}
        >
          {error ?? hint}
        </span>
      )}
    </label>
  );
}
