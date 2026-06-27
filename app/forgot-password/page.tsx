import { AuthBackground } from "@/features/auth/components/auth-shell";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center px-6 py-10">
      <AuthBackground />
      <div className="w-full max-w-md">
        <ForgotPasswordForm />
      </div>
    </main>
  );
}