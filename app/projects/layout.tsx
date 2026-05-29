"use client";

import { ProtectedRoute } from "@/features/auth/components/protected-route";

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
