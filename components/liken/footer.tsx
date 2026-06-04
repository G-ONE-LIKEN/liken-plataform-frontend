import Link from "next/link"
import { FaXTwitter, FaLinkedinIn, FaGithub, FaTelegram } from "react-icons/fa6"
import { BrandMark } from "@/components/liken/atmosphere"

const footerLinks = {
  platform: [
    { name: "Proyectos", href: "#proyectos" },
    { name: "Tokenomics", href: "#tokenomics" },
    { name: "Cómo Funciona", href: "#como-funciona" },
    { name: "Nosotros", href: "#nosotros" },
  ],
  company: [
    { name: "Equipo", href: "#" },
    { name: "Carreras", href: "#" },
    { name: "Blog", href: "#" },
  ],
  legal: [
    { name: "Términos", href: "#" },
    { name: "Privacidad", href: "#" },
    { name: "Cookies", href: "#" },
    { name: "Licencias", href: "#" },
  ],
  support: [
    { name: "Iniciar Sesión", href: "/login" },
    { name: "Crear Cuenta", href: "/register" },
    { name: "Centro de Ayuda", href: "#" },
    { name: "FAQ", href: "#" },
  ],
}

const socialLinks = [
  { name: "X / Twitter", icon: FaXTwitter, href: "#" },
  { name: "LinkedIn", icon: FaLinkedinIn, href: "#" },
  { name: "GitHub", icon: FaGithub, href: "#" },
  { name: "Telegram", icon: FaTelegram, href: "#" },
]

export function Footer() {
  return (
    <footer id="nosotros" className="relative border-t border-border/50 bg-card/30">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
      />
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-6">
          {/* Brand */}
          <div className="lg:col-span-2">
            <BrandMark size="lg" />
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
                  <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Empresa</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Legal</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Acceso</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {link.name}
                  </Link>
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
              Construido con tecnología blockchain para un futuro sostenible.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
