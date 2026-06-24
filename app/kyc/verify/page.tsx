import { AuthBackground } from "@/features/auth/components/auth-shell";
import { KycVerify } from "@/features/kyc/components/kyc-verify";

export default function KycVerifyPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center px-6 py-10">
      <AuthBackground />
      <div className="w-full max-w-md">
        <KycVerify />
      </div>
    </main>
  );
}