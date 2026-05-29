import { Card } from "@/shared/ui/card";
import { EmptyState } from "@/shared/ui/empty-state";
import { PageHeader } from "@/shared/ui/page-header";
import { StatPanel } from "@/shared/ui/stat-panel";

export default function DashboardInvestmentsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Inversiones"
        title="Mi cartera"
        description="Aqui vas a seguir cuanto invertiste, cuanto rinden tus participaciones y como evolucionan tus dividendos."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatPanel label="Invertido" value="0 USD" hint="Se activara cuando el flujo de compra quede conectado al backend." />
        <StatPanel label="Dividendos" value="0 USD" hint="La liquidacion automatica aparecera aqui cuando exista el servicio correspondiente." />
        <StatPanel label="Rentabilidad" value="0%" hint="Vista lista para mostrar yield real por proyecto." />
      </div>

      <Card title="Estado actual" description="La estructura ya esta lista aunque el modulo financiero todavia no cierre extremo a extremo.">
        <EmptyState
          title="Todavia no tienes inversiones registradas"
          description="Cuando el flujo de inversion, pagos y dividendos quede conectado, este espacio mostrara tu cartera y su rendimiento."
        />
      </Card>
    </>
  );
}
