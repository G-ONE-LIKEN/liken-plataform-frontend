import { Bell, Moon, Shield, Globe, Palette } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

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

      <div className="grid gap-6 md:grid-cols-2">
        {sections.map((section) => (
          <Card key={section.title} className="bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <section.icon className="h-5 w-5 text-primary" />
                {section.title}
              </CardTitle>
              <CardDescription>{section.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" disabled>
                Próximamente
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
