import { Suspense } from "react";
import { AuthBackground } from "@/features/auth/components/auth-shell";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center px-6 py-10">
      <AuthBackground />
      <div className="w-full max-w-md">
        <Suspense fallback={null}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </main>
  );
}