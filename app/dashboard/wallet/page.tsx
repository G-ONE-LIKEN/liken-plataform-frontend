"use client"

import { Wallet, ArrowUpRight, ArrowDownLeft, ExternalLink, Zap, DollarSign, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Web3Provider } from "@/features/web3/components/web3-provider"
import { WalletStatusCard } from "@/features/web3/components/wallet-status-card"
import { PayForm } from "@/features/web3/components/pay-form"
import { PaymentFeed } from "@/features/web3/components/payment-feed"
import { CardOnramp } from "@/features/web3/components/card-onramp"
import { env } from "@/shared/config/env"

function ConfigRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-secondary/50 px-4 py-3">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-2 break-all text-sm font-medium text-foreground">{value || "No configurado"}</div>
    </div>
  )
}

const balances = [
  { token: "USDC", name: "USD Coin (Sepolia)", balance: "—", value: "—", Icon: DollarSign },
  { token: "LKN", name: "LIKEN Token", balance: "0", value: "$0.00", Icon: Zap },
]

export default function WalletPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Mi Wallet</h1>
        <p className="mt-1 text-muted-foreground">Gestiona tus fondos, tokens y conexión blockchain</p>
      </div>

      {/* Balance overview */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="bg-gradient-to-br from-primary/20 to-background lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
                <Wallet className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Balance Total</p>
                <p className="text-4xl font-bold text-foreground">$0.00</p>
                <p className="mt-1 text-xs text-muted-foreground">Conectá tu wallet para ver el balance real</p>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <Button className="flex-1 gap-2">
                <ArrowDownLeft className="h-4 w-4" />
                Depositar
              </Button>
              <Button variant="outline" className="flex-1 gap-2">
                <ArrowUpRight className="h-4 w-4" />
                Retirar
              </Button>
              <Button variant="outline" className="flex-1 gap-2">
                <Zap className="h-4 w-4" />
                Swap
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Depósito Rápido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Monto (USDC)</label>
              <Input type="number" placeholder="0.00" />
            </div>
            <div className="grid grid-cols-4 gap-2">
              <Button variant="outline" size="sm">$100</Button>
              <Button variant="outline" size="sm">$250</Button>
              <Button variant="outline" size="sm">$500</Button>
              <Button variant="outline" size="sm">$1K</Button>
            </div>
            <Button className="w-full">Depositar</Button>
          </CardContent>
        </Card>
      </div>

      {/* Web3 — conexión + onramp */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Web3Provider>
          <WalletStatusCard />
        </Web3Provider>
        <Web3Provider>
          <CardOnramp />
        </Web3Provider>
      </div>

      {/* Web3 — pago con USDC + feed en vivo */}
      <Web3Provider>
        <div className="grid gap-6 lg:grid-cols-2">
          <PayForm />
          <PaymentFeed />
        </div>
      </Web3Provider>

      {/* Entorno blockchain */}
      <details className="group">
        <summary className="flex cursor-pointer list-none items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
          Configuración avanzada de red
        </summary>
        <Card className="mt-3 bg-card">
          <CardContent className="grid gap-3 pt-6 sm:grid-cols-2">
            <ConfigRow label="Chain ID" value={String(env.chainId)} />
            <ConfigRow label="PaymentGateway" value={env.paymentGatewayAddress} />
            <ConfigRow label="USDC" value={env.usdcAddress} />
            <ConfigRow label="Onramp" value={env.onrampAddress} />
          </CardContent>
        </Card>
      </details>

      {/* Balances & historial */}
      <Tabs defaultValue="balances" className="space-y-6">
        <TabsList className="bg-secondary">
          <TabsTrigger value="balances">Balances</TabsTrigger>
          <TabsTrigger value="transactions">Transacciones</TabsTrigger>
        </TabsList>

        <TabsContent value="balances">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Mis Tokens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {balances.map((item) => (
                  <div key={item.token} className="flex items-center justify-between rounded-lg bg-secondary/50 p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <item.Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{item.token}</p>
                        <p className="text-sm text-muted-foreground">{item.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">{item.balance}</p>
                      <p className="text-sm text-muted-foreground">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Historial de Transacciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <ExternalLink className="mb-3 h-10 w-10 opacity-40" />
                <p className="text-sm">No hay transacciones registradas aún.</p>
                <p className="mt-1 text-xs">Las transacciones on-chain aparecerán aquí.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
