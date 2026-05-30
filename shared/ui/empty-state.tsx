import Link from "next/link";
import { Card } from "@/shared/ui/card";
import { buttonStyles } from "@/shared/ui/button";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: { label: string; href: string };
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <Card className="border-dashed text-center" title={title} description={description}>
      <div className="mx-auto max-w-xl rounded-[24px] bg-[var(--color-surface)] px-6 py-10 text-sm text-[var(--color-foreground-muted)]">
        Esta sección todavía no tiene datos suficientes o depende de servicios que siguen en construcción.
        {action && (
          <div className="mt-4">
            <Link href={action.href} className={buttonStyles("secondary", "text-sm")}>
              {action.label}
            </Link>
          </div>
        )}
      </div>
    </Card>
  );
}
