import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
};

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-3">
        {eyebrow && (
          <span className="inline-flex text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-primary-strong)]">
            {eyebrow}
          </span>
        )}
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-foreground)] sm:text-3xl">
            {title}
          </h1>
          <p className="max-w-3xl text-sm leading-6 text-[var(--color-foreground-muted)] sm:text-[15px]">
            {description}
          </p>
        </div>
      </div>
      {actions}
    </div>
  );
}
