import { Card } from "@/shared/ui/card";

type StatPanelProps = {
  label: string;
  value: string;
  hint: string;
};

export function StatPanel({ label, value, hint }: StatPanelProps) {
  return (
    <Card className="h-full">
      <div className="space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-foreground-subtle)]">
          {label}
        </p>
        <p className="text-2xl font-semibold tracking-tight text-[var(--color-foreground)]">{value}</p>
        <p className="text-sm leading-6 text-[var(--color-foreground-muted)]">{hint}</p>
      </div>
    </Card>
  );
}
