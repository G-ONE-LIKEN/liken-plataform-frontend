"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/providers/theme-provider";
import { cn } from "@/shared/lib/utils";

function subscribe() {
  return () => undefined;
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const isHydrated = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

  if (!isHydrated) {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-panel)] p-1 shadow-sm",
          className,
        )}
      >
        <div className="h-9 w-[124px] rounded-full bg-[var(--color-surface)]" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-panel)] p-1 shadow-sm",
        className,
      )}
    >
      <ThemeButton
        active={theme === "light"}
        icon={<Sun className="h-4 w-4" />}
        label="Claro"
        onClick={() => setTheme("light")}
      />
      <ThemeButton
        active={theme === "dark"}
        icon={<Moon className="h-4 w-4" />}
        label="Oscuro"
        onClick={() => setTheme("dark")}
      />
    </div>
  );
}

function ThemeButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition",
        active
          ? "bg-[var(--color-primary)] text-[var(--color-primary-foreground)]"
          : "text-[var(--color-foreground-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-foreground)]",
      )}
    >
      {icon}
      {label}
    </button>
  );
}
