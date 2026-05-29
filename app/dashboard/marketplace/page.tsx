import { TrendingUp, TrendingDown, ArrowUpRight, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const tokens = [
  { symbol: "LKN", name: "LIKEN Token", price: "$0.85", change: "+5.2%", trend: "up", volume: "$1.2M", marketCap: "$42M" },
  { symbol: "LKN-SOL", name: "Solar Energy Token", price: "$1.25", change: "+3.8%", trend: "up", volume: "$890K", marketCap: "$28M" },
  { symbol: "LKN-EOL", name: "Wind Energy Token", price: "$1.10", change: "-1.2%", trend: "down", volume: "$650K", marketCap: "$22M" },
  { symbol: "LKN-HID", name: "Hydro Energy Token", price: "$0.95", change: "+2.1%", trend: "up", volume: "$420K", marketCap: "$15M" },
]

const orderBook = {
  asks: [
    { price: "$0.87", amount: "12,500 LKN" },
    { price: "$0.86", amount: "8,200 LKN" },
    { price: "$0.855", amount: "15,000 LKN" },
  ],
  bids: [
    { price: "$0.845", amount: "10,000 LKN" },
    { price: "$0.84", amount: "22,500 LKN" },
    { price: "$0.835", amount: "18,000 LKN" },
  ],
}

const recentTrades = [
  { time: "14:32:15", type: "buy", price: "$0.85", amount: "500 LKN" },
  { time: "14:31:42", type: "sell", price: "$0.849", amount: "1,200 LKN" },
  { time: "14:30:58", type: "buy", price: "$0.85", amount: "800 LKN" },
  { time: "14:29:33", type: "buy", price: "$0.848", amount: "2,500 LKN" },
  { time: "14:28:12", type: "sell", price: "$0.847", amount: "650 LKN" },
]

export default function MarketplacePage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Marketplace</h1>
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
                  <th className="pb-3 font-medium">Market Cap</th>
                  <th className="pb-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {tokens.map((token) => (
                  <tr key={token.symbol} className="text-sm">
                    <td className="py-4">
                      <p className="font-semibold text-foreground">{token.symbol}</p>
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
                    <td className="py-4 text-muted-foreground">{token.marketCap}</td>
                    <td className="py-4">
                      <Button size="sm" className="gap-1">
                        Trade <ArrowUpRight className="h-3 w-3" />
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
          <CardHeader><CardTitle>Libro de Órdenes — LKN</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="mb-2 text-xs font-medium text-red-500">ASKS (Venta)</p>
              {orderBook.asks.map((ask, i) => (
                <div key={i} className="flex justify-between py-1 text-sm">
                  <span className="text-red-500">{ask.price}</span>
                  <span className="text-muted-foreground">{ask.amount}</span>
                </div>
              ))}
            </div>
            <div className="border-y border-border py-3 text-center">
              <p className="text-lg font-bold text-foreground">$0.85</p>
              <p className="text-xs text-muted-foreground">Precio actual</p>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium text-green-500">BIDS (Compra)</p>
              {orderBook.bids.map((bid, i) => (
                <div key={i} className="flex justify-between py-1 text-sm">
                  <span className="text-green-500">{bid.price}</span>
                  <span className="text-muted-foreground">{bid.amount}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader><CardTitle>Comprar / Vender</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <Button className="bg-green-600 hover:bg-green-700">Comprar</Button>
              <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-500/10">Vender</Button>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Cantidad (LKN)</label>
              <Input type="number" placeholder="0.00" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Precio (USD)</label>
              <Input type="number" placeholder="0.85" />
            </div>
            <div className="rounded-lg bg-secondary p-3 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total</span>
                <span className="font-medium text-foreground">$0.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Fee (0.1%)</span>
                <span className="font-medium text-foreground">$0.00</span>
              </div>
            </div>
            <Button className="w-full">Confirmar Orden</Button>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader><CardTitle>Trades Recientes</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentTrades.map((trade, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{trade.time}</span>
                  <span className={trade.type === "buy" ? "text-green-500" : "text-red-500"}>{trade.price}</span>
                  <span className="text-foreground">{trade.amount}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
