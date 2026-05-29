import { Card } from "@/shared/ui/card";

type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <Card className="border-dashed text-center" title={title} description={description}>
      <div className="mx-auto max-w-xl rounded-[24px] bg-[var(--color-surface)] px-6 py-10 text-sm text-[var(--color-foreground-muted)]">
        Esta sección todavía no tiene datos suficientes o depende de servicios que siguen en construcción.
      </div>
    </Card>
  );
}
