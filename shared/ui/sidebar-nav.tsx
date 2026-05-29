"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/shared/config/navigation";
import type { PermissionContext } from "@/features/auth/types/auth";
import { cn } from "@/shared/lib/utils";

type SidebarNavProps = {
  items: NavItem[];
  permissions: PermissionContext;
};

export function SidebarNav({ items, permissions }: SidebarNavProps) {
  const pathname = usePathname();

  const visibleItems = items.filter((item) => {
    if (!item.permission) return true;
    return permissions[item.permission];
  });

  return (
    <nav className="grid gap-2">
      {visibleItems.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-xl border px-3 py-3 transition",
              active
                ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-primary-foreground)] shadow-sm"
                : "border-transparent text-[var(--color-foreground-muted)] hover:border-[var(--color-border)] hover:bg-[var(--color-surface)] hover:text-[var(--color-foreground)]",
            )}
          >
            <div className="font-semibold">{item.label}</div>
            <div className={cn("mt-1 text-xs leading-5", active ? "opacity-80" : "text-[var(--color-foreground-subtle)]")}>
              {item.description}
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
