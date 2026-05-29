import { Sun, Wind, Droplets, TrendingUp, ArrowUpRight, Download, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function InvestmentsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mis Inversiones</h1>
          <p className="mt-1 text-muted-foreground">Gestiona y monitorea tu portafolio de inversiones</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Exportar Reporte
        </Button>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Invertido", value: "$0.00" },
          { label: "Valor Actual", value: "$0.00" },
          { label: "Rendimientos", value: "$0.00", green: true },
          { label: "APY Promedio", value: "—", primary: true },
        ].map((item) => (
          <Card key={item.label} className="bg-card">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className={`mt-2 text-2xl font-bold ${item.green ? "text-green-500" : item.primary ? "text-primary" : "text-foreground"}`}>
                {item.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="portfolio" className="space-y-6">
        <TabsList className="bg-secondary">
          <TabsTrigger value="portfolio">Portafolio</TabsTrigger>
          <TabsTrigger value="transactions">Transacciones</TabsTrigger>
        </TabsList>

        <TabsContent value="portfolio" className="space-y-4">
          <Card className="bg-card">
            <CardContent className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Leaf className="mb-3 h-10 w-10 opacity-40" />
              <p className="text-sm font-medium">No tenés inversiones activas aún.</p>
              <p className="mt-1 text-xs">Explorá proyectos y empezá a invertir.</p>
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
                <TrendingUp className="mb-3 h-10 w-10 opacity-40" />
                <p className="text-sm">No hay transacciones registradas.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
