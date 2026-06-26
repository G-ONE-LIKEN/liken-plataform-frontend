import { AuthBackground } from "@/features/auth/components/auth-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function KycPendingPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center px-6 py-10">
      <AuthBackground />
      <div className="w-full max-w-md">
        <Card className="border-none shadow-2xl bg-background/60 backdrop-blur-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Identidad en revisión</CardTitle>
            <CardDescription>
              Tus datos están siendo validados. Este proceso suele tomar unos instantes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-sm text-muted-foreground">
              Una vez que se apruebe tu verificación, vas a tener acceso completo a la plataforma. Mientras tanto podés acceder al Dashboard.
            </p>
            <Button className="w-full" asChild>
              <Link href="/dashboard">Ir al Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
