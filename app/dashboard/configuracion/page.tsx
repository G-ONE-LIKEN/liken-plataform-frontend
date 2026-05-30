import { Bell, Shield, Globe, Palette, Construction } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const sections = [
  {
    icon: Bell,
    title: "Notificaciones",
    description: "Configurá qué alertas querés recibir sobre tus inversiones y proyectos.",
  },
  {
    icon: Shield,
    title: "Seguridad",
    description: "Gestioná autenticación de dos factores y sesiones activas.",
  },
  {
    icon: Globe,
    title: "Idioma y región",
    description: "Cambiá el idioma, moneda de visualización y zona horaria.",
  },
  {
    icon: Palette,
    title: "Apariencia",
    description: "Modo oscuro / claro y preferencias de interfaz.",
  },
]

export default function ConfiguracionPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Configuración</h1>
        <p className="mt-1 text-muted-foreground">Personalizá tu experiencia en LIKEN</p>
      </div>

      {/* Banner "en desarrollo" */}
      <div className="flex items-start gap-4 rounded-xl border border-primary/20 bg-primary/5 px-5 py-4">
        <Construction className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <div>
          <p className="text-sm font-medium text-foreground">Estas funciones están en desarrollo</p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Notificaciones, seguridad avanzada, preferencias de idioma y apariencia estarán disponibles próximamente.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {sections.map((section) => (
          <Card key={section.title} className="bg-card opacity-60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <section.icon className="h-5 w-5 text-primary" />
                {section.title}
              </CardTitle>
              <CardDescription>{section.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
                <Construction className="h-3 w-3" />
                En desarrollo
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
