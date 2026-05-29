import { env } from "@/shared/config/env";
import { WalletStatusCard } from "@/features/web3/components/wallet-status-card";
import { Web3Provider } from "@/features/web3/components/web3-provider";
import { Card } from "@/shared/ui/card";
import { PageHeader } from "@/shared/ui/page-header";
import { StatPanel } from "@/shared/ui/stat-panel";

export default function DashboardWalletPage() {
  return (
    <>
      <PageHeader
        eyebrow="Wallet"
        title="Mi billetera"
        description="Un punto unico para ver saldo, tokens LIKEN, ganancias y la conexion blockchain de la cuenta."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatPanel label="Saldo fiat" value="0 USD" hint="Preparado para integrarse con la pasarela de pagos." />
        <StatPanel label="Tokens LIKEN" value="0" hint="Se activara junto con la tokenizacion y mercado secundario." />
        <StatPanel label="Ganancias" value="0 USD" hint="Dividendos y plusvalias cuando el modulo financiero este listo." />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <Web3Provider>
          <WalletStatusCard />
        </Web3Provider>

        <Card title="Entorno blockchain" description="Configuracion publica para la siguiente etapa Web3.">
          <div className="grid gap-3 text-sm text-[var(--color-foreground-muted)]">
            <ConfigRow label="Chain ID" value={String(env.chainId)} />
            <ConfigRow label="PaymentGateway" value={env.paymentGatewayAddress} />
            <ConfigRow label="USDC" value={env.usdcAddress} />
            <ConfigRow label="Onramp" value={env.onrampAddress} />
          </div>
        </Card>
      </div>
    </>
  );
}

function ConfigRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-foreground-subtle)]">{label}</div>
      <div className="mt-2 break-all text-sm font-medium text-[var(--color-foreground)]">{value}</div>
    </div>
  );
}
