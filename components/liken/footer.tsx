import Link from "next/link"
import { Zap, Send, Globe, BookOpen, MessageCircle } from "lucide-react"

const footerLinks = {
  platform: [
    { name: "Proyectos", href: "/#proyectos" },
    { name: "Cómo Funciona", href: "/#como-funciona" },
    { name: "Tokenomics", href: "/#tokenomics" },
    { name: "Whitepaper", href: "#", disabled: true },
  ],
  company: [
    { name: "Nosotros", href: "/#nosotros" },
    { name: "Equipo", href: "#", disabled: true },
    { name: "Carreras", href: "#", disabled: true },
    { name: "Blog", href: "#", disabled: true },
  ],
  legal: [
    { name: "Términos", href: "#", disabled: true },
    { name: "Privacidad", href: "#", disabled: true },
    { name: "Cookies", href: "#", disabled: true },
  ],
  support: [
    { name: "Iniciar Sesión", href: "/login" },
    { name: "Registrarse", href: "/register" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "FAQ", href: "#", disabled: true },
  ],
}

const socialLinks = [
  { name: "Web", icon: Globe, href: "#" },
  { name: "Telegram", icon: Send, href: "#" },
  { name: "Docs", icon: BookOpen, href: "#" },
  { name: "Discord", icon: MessageCircle, href: "#" },
]

export function Footer() {
  return (
    <footer id="nosotros" className="border-t border-border/50 bg-card/30">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-6">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Zap className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">LIKEN</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Democratizando las inversiones en energía renovable a través de tecnología blockchain.
            </p>
            <div className="mt-6 flex gap-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/50 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                >
                  <social.icon className="h-5 w-5" />
                  <span className="sr-only">{social.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Plataforma</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  {"disabled" in link && link.disabled ? (
                    <span className="text-sm text-muted-foreground/50 cursor-not-allowed">{link.name}</span>
                  ) : (
                    <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Empresa</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  {"disabled" in link && link.disabled ? (
                    <span className="text-sm text-muted-foreground/50 cursor-not-allowed">{link.name}</span>
                  ) : (
                    <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Legal</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  {"disabled" in link && link.disabled ? (
                    <span className="text-sm text-muted-foreground/50 cursor-not-allowed">{link.name}</span>
                  ) : (
                    <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Acceso</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  {"disabled" in link && link.disabled ? (
                    <span className="text-sm text-muted-foreground/50 cursor-not-allowed">{link.name}</span>
                  ) : (
                    <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-border/50 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              © 2026 LIKEN. Todos los derechos reservados.
            </p>
            <p className="text-sm text-muted-foreground">
              Plataforma de inversión en energía renovable con tecnología blockchain.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
