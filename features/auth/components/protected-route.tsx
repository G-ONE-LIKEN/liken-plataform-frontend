"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/providers/session-provider";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, user } = useSession();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!isLoading && isAuthenticated && user && !user.profileCompleted && pathname !== "/complete-profile") {
      router.replace(`/complete-profile?next=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, isLoading, pathname, router, user]);

  if (isLoading || !isAuthenticated || (user && !user.profileCompleted && pathname !== "/complete-profile")) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="rounded-full border border-[var(--color-border)] bg-[var(--color-panel)] px-5 py-3 text-sm text-[var(--color-foreground-muted)]">
          Validando sesion...
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
