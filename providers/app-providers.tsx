"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "@/providers/session-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { ForbiddenError, UnauthorizedError } from "@/shared/lib/api-client";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: (_failureCount, error) =>
              !(error instanceof UnauthorizedError || error instanceof ForbiddenError),
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SessionProvider>{children}</SessionProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
