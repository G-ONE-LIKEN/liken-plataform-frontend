import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/shared/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export function buttonStyles(variant: ButtonProps["variant"] = "primary", className?: string) {
  return cn(
    "inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-surface)] disabled:cursor-not-allowed disabled:opacity-60",
    variant === "primary" &&
      "bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-strong)] focus:ring-[var(--color-primary)]",
    variant === "secondary" &&
      "border border-[var(--color-border)] bg-[var(--color-panel)] text-[var(--color-foreground)] hover:bg-[var(--color-surface)] focus:ring-[var(--color-primary)]",
    variant === "ghost" &&
      "bg-transparent text-[var(--color-foreground-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-foreground)] focus:ring-[var(--color-primary)]",
    variant === "danger" &&
      "bg-[var(--color-danger)] text-white hover:bg-[#c2414b] focus:ring-[var(--color-danger)]",
    className,
  );
}

export function Button({
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonStyles(variant, className)}
      {...props}
    />
  );
}
