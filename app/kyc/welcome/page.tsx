import { AuthBackground } from "@/features/auth/components/auth-shell";
import { KycWelcome } from "@/features/kyc/components/kyc-welcome";

export default function KycWelcomePage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center px-6 py-10">
      <AuthBackground />
      <div className="w-full max-w-md">
        <KycWelcome />
      </div>
    </main>
  );
}