"use client";

import { useState, useEffect } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { TrendingUp, TrendingDown, ArrowUpRight, Search, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useOpenOrders, useBuyOrder, useCreateOrder } from "../hooks/useOrderBook";
import { KycGate } from "@/features/kyc/components/kyc-gate";
import { useKycGate } from "@/features/kyc/hooks/use-kyc-gate";
import { ERC20_ABI } from "@/features/web3/lib/abis";
import { CONTRACTS } from "@/features/web3/lib/contracts";
import { env } from "@/shared/config/env";
import { parseUnits, formatUnits } from "viem";
import { toast } from "@/hooks/use-toast";


const tokens = [
  { projectId: 1, symbol: "LKN", name: "LIKEN Token", price: "$0.85", change: "+5.2%", trend: "up", volume: "$1.2M", marketCap: "$42M" },
  { projectId: 2, symbol: "LKN-SOL", name: "Solar Energy Token", price: "$1.25", change: "+3.8%", trend: "up", volume: "$890K", marketCap: "$28M" },
];

export function MarketplaceView() {
  const [selectedProjectId, setSelectedProjectId] = useState<number>(1);
  const [sellAmount, setSellAmount] = useState<string>("");
  const [sellPrice, setSellPrice] = useState<string>("");
  const [orderSubmitted, setOrderSubmitted] = useState<boolean>(false);
  const [activeAction, setActiveAction] = useState<"sell" | "buy" | null>(null);
  const [selectedBuyOrder, setSelectedBuyOrder] = useState<any>(null);
  const { address } = useAccount();

  const { data: openOrders, isLoading: isLoadingOrders } = useOpenOrders(selectedProjectId);
  const buyOrderMutation = useBuyOrder();
  const createOrderMutation = useCreateOrder();
  const { isApproved: isKycApproved } = useKycGate();

  const { data: hash, isPending: isApproving, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const handleApproveAndSell = () => {
    if (!sellAmount || !sellPrice) return;
    setOrderSubmitted(false);
    setActiveAction("sell");
    
    // 1. Approve LKN for LknMarketplace contract address
    const amountWei = parseUnits(sellAmount, 18);
    writeContract({
      address: CONTRACTS.linkenToken,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [env.marketplaceAddress as `0x${string}`, amountWei],
    }, {
      onError: (err: any) => {
        toast({
          title: "Error de Aprobación",
          description: err instanceof Error ? err.message : "Intente nuevamente.",
          variant: "destructive",
        });
        setActiveAction(null);
      }
    });
  };

  const handleBuy = (order: any) => {
    setActiveAction("buy");
    setSelectedBuyOrder(order);
    
    // Total USDC = tokensAmount * pricePerToken
    const totalUsdc = order.tokensAmount * order.pricePerToken;
    const amountUSDC6 = parseUnits(totalUsdc.toString(), 6);
    
    writeContract({
      address: env.usdcAddress as `0x${string}`,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [env.marketplaceAddress as `0x${string}`, amountUSDC6],
    }, {
      onError: (err: any) => {
        toast({
          title: "Error de Aprobación",
          description: err instanceof Error ? err.message : "Intente nuevamente.",
          variant: "destructive",
        });
        setActiveAction(null);
        setSelectedBuyOrder(null);
      }
    });
  };

  useEffect(() => {
    if (isConfirmed && activeAction === "buy" && selectedBuyOrder) {
      buyOrderMutation.mutate(selectedBuyOrder.id, {
        onSuccess: () => {
          toast({
            title: "Compra iniciada exitosamente",
            description: "Aprobación de USDC confirmada. El backend está liquidando el intercambio on-chain.",
          });
          setActiveAction(null);
          setSelectedBuyOrder(null);
        },
        onError: (err: any) => {
          toast({
            title: "Error al comprar",
            description: err instanceof Error ? err.message : "Intente nuevamente.",
            variant: "destructive",
          });
          setActiveAction(null);
          setSelectedBuyOrder(null);
        }
      });
    }
  }, [isConfirmed, activeAction, selectedBuyOrder]);

  const selectedToken = tokens.find((t) => t.projectId === selectedProjectId);

  // Split orders into Asks (Sell) and Bids (Buy)
  const asks = openOrders?.filter((o) => o.side === "SELL").sort((a, b) => a.pricePerToken - b.pricePerToken) || [];
  const bids = openOrders?.filter((o) => o.side === "BUY").sort((a, b) => b.pricePerToken - a.pricePerToken) || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_oklch(0.72_0.16_165)]" />
            Trading P2P
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Marketplace</h1>
          <p className="mt-1 text-muted-foreground">Compra y vende tokens de energía renovable</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar tokens..." className="w-64 pl-10" />
        </div>
      </div>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Tokens Disponibles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left text-sm text-muted-foreground">
                  <th className="pb-3 font-medium">Token</th>
                  <th className="pb-3 font-medium">Precio</th>
                  <th className="pb-3 font-medium">24h</th>
                  <th className="pb-3 font-medium">Volumen</th>
                  <th className="pb-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {tokens.map((token) => (
                  <tr key={token.symbol} className="text-sm cursor-pointer hover:bg-secondary/20" onClick={() => setSelectedProjectId(token.projectId)}>
                    <td className="py-4">
                      <p className={`font-semibold ${selectedProjectId === token.projectId ? "text-primary" : "text-foreground"}`}>{token.symbol}</p>
                      <p className="text-xs text-muted-foreground">{token.name}</p>
                    </td>
                    <td className="py-4 font-medium text-foreground">{token.price}</td>
                    <td className={`py-4 font-medium ${token.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                      <span className="flex items-center gap-1">
                        {token.trend === "up" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                        {token.change}
                      </span>
                    </td>
                    <td className="py-4 text-muted-foreground">{token.volume}</td>
                    <td className="py-4">
                      <Button size="sm" variant={selectedProjectId === token.projectId ? "default" : "outline"} className="gap-1">
                        Ver Libro <ArrowUpRight className="h-3 w-3" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="bg-card">
          <CardHeader><CardTitle>Libro de Órdenes — {selectedToken?.symbol}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="mb-2 text-xs font-medium text-red-500">ASKS (En Venta)</p>
              {isLoadingOrders ? <p className="text-sm text-muted-foreground">Cargando...</p> : asks.map((ask) => (
                <div key={ask.id} className="flex justify-between py-1 text-sm items-center">
                  <span className="text-red-500">${ask.pricePerToken.toFixed(2)}</span>
                  <span className="text-muted-foreground">{ask.tokensAmount} LKN</span>
                  <Button
                    size="sm"
                    className="h-6 text-xs bg-green-600 hover:bg-green-700"
                    onClick={() => handleBuy(ask)}
                    disabled={!isKycApproved || (activeAction === "buy" && selectedBuyOrder?.id === ask.id && (isApproving || isConfirming)) || buyOrderMutation.isPending}
                    title={!isKycApproved ? "Verificá tu identidad para operar" : undefined}
                  >
                    {activeAction === "buy" && selectedBuyOrder?.id === ask.id ? "Comprando..." : "Comprar"}
                  </Button>
                </div>
              ))}
              {asks.length === 0 && !isLoadingOrders && <p className="text-sm text-muted-foreground italic">No hay órdenes de venta</p>}
            </div>
            
            <div className="border-y border-border py-3 text-center">
              <p className="bg-gradient-to-r from-primary to-accent bg-clip-text text-lg font-bold text-transparent">{selectedToken?.price}</p>
              <p className="text-xs text-muted-foreground">Precio actual</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card lg:col-span-2">
          <CardHeader><CardTitle>Crear Orden de Venta</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <KycGate reason="Para operar en el marketplace necesitás verificar tu identidad.">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Cantidad ({selectedToken?.symbol})</label>
              <Input type="number" placeholder="0.00" value={sellAmount} onChange={(e) => setSellAmount(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Precio (USD)</label>
              <Input type="number" placeholder="0.85" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} />
            </div>
            <div className="rounded-lg bg-secondary p-3 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Recibirás</span>
                <span className="font-medium text-foreground">${((parseFloat(sellAmount || "0") * parseFloat(sellPrice || "0")) * 0.99).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Fee (1%)</span>
                <span className="font-medium text-foreground">${((parseFloat(sellAmount || "0") * parseFloat(sellPrice || "0")) * 0.01).toFixed(2)}</span>
              </div>
            </div>
            
            <Button 
              className="w-full" 
              onClick={handleApproveAndSell} 
              disabled={isApproving || isConfirming || !sellAmount || !sellPrice || createOrderMutation.isPending}
            >
              {isApproving && activeAction === "sell" ? "Aprobando en Wallet..." : isConfirming && activeAction === "sell" ? "Confirmando Tx..." : "Vender (Aprobar on-chain primero)"}
            </Button>
            
            {isConfirmed && activeAction === "sell" && !orderSubmitted && (
               <div className="mt-4">
                 <p className="text-sm text-green-500 flex items-center gap-1 mb-2"><CheckCircle2 className="w-4 h-4" /> Aprobado! Creando orden...</p>
                 <Button 
                    className="w-full" 
                    onClick={() => {
                      createOrderMutation.mutate({
                        projectId: selectedProjectId,
                        tokensAmount: parseFloat(sellAmount),
                        pricePerToken: parseFloat(sellPrice)
                      }, {
                        onSuccess: () => {
                          toast({
                            title: "Orden creada exitosamente",
                            description: `Se publicó tu orden de venta por ${sellAmount} LKN a $${sellPrice} c/u.`,
                          });
                          setSellAmount("");
                          setSellPrice("");
                          setOrderSubmitted(true);
                        },
                        onError: (err: any) => {
                          toast({
                            title: "Error al crear la orden",
                            description: err instanceof Error ? err.message : "Intente nuevamente.",
                            variant: "destructive"
                          });
                        }
                      })
                    }}
                    disabled={createOrderMutation.isPending}
                 >
                    {createOrderMutation.isPending ? "Creando..." : "Confirmar Orden en Marketplace"}
                 </Button>
               </div>
            )}
            </KycGate>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
