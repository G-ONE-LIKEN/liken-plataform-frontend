import { Suspense } from "react";
import { CompleteProfileForm } from "@/features/auth/components/complete-profile-form";
import { ProtectedRoute } from "@/features/auth/components/protected-route";
import { AuthBackground } from "@/features/auth/components/auth-shell";

export default function CompleteProfilePage() {
  return (
    <ProtectedRoute>
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-10">
        <AuthBackground />
        <Suspense fallback={<div className="h-96 w-full max-w-2xl animate-pulse rounded-[1.5rem] bg-card" />}>
          <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            <CompleteProfileForm />
          </div>
        </Suspense>
      </main>
    </ProtectedRoute>
  );
}
