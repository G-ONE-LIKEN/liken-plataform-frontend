import { Suspense } from "react";
import { CompleteProfileForm } from "@/features/auth/components/complete-profile-form";
import { ProtectedRoute } from "@/features/auth/components/protected-route";

export default function CompleteProfilePage() {
  return (
    <ProtectedRoute>
      <main className="flex min-h-screen items-center justify-center px-6 py-10">
        <Suspense fallback={<div className="h-96 w-full max-w-2xl animate-pulse rounded-lg bg-card" />}>
          <CompleteProfileForm />
        </Suspense>
      </main>
    </ProtectedRoute>
  );
}
