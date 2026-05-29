import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  title?: string;
  description?: string;
  actions?: ReactNode;
};

export function Card({
  className,
  title,
  description,
  actions,
  children,
  ...props
}: CardProps) {
  return (
    <section
      className={cn(
        "rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] p-5 shadow-[0_10px_30px_rgba(17,27,39,0.06)]",
        className,
      )}
      {...props}
    >
      {(title || description || actions) && (
        <header className="mb-4 flex items-start justify-between gap-4">
          <div className="space-y-1">
            {title && <h3 className="text-base font-semibold text-[var(--color-foreground)]">{title}</h3>}
            {description && (
              <p className="text-sm leading-6 text-[var(--color-foreground-muted)]">{description}</p>
            )}
          </div>
          {actions}
        </header>
      )}
      {children}
    </section>
  );
}
