"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { useSession } from "@/providers/session-provider"
import { BrandMark } from "@/components/liken/atmosphere"

const navigation = [
  { name: "Proyectos", href: "#proyectos" },
  { name: "Cómo Funciona", href: "#como-funciona" },
  { name: "Tokenomics", href: "#tokenomics" },
  { name: "Nosotros", href: "#nosotros" },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useSession()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      {/* Hairline degradada superior — firma de marca */}
      <div
        aria-hidden
        className="h-px w-full bg-gradient-to-r from-transparent via-primary/60 to-transparent"
      />
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5 lg:px-8">

        {/* Brand */}
        <BrandMark size="sm" />

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-7 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-2.5 lg:flex">
          {user ? (
            <Button
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-4"
              asChild
            >
              <Link href="/dashboard">Mi Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button
                size="sm"
                variant="ghost"
                className="text-muted-foreground hover:text-foreground hover:bg-secondary px-4"
                asChild
              >
                <Link href="/login">Iniciar Sesión</Link>
              </Button>
              <Button
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-4"
                asChild
              >
                <Link href="/register">Crear Cuenta</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Abrir menú</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 bg-card border-border">
            <div className="flex flex-col gap-5 pt-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-base font-medium text-foreground hover:text-primary transition-colors"
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex flex-col gap-2.5 pt-4 border-t border-border">
                {user ? (
                  <Button className="w-full bg-primary text-primary-foreground" asChild>
                    <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                      Mi Dashboard
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        Iniciar Sesión
                      </Link>
                    </Button>
                    <Button className="w-full bg-primary text-primary-foreground" asChild>
                      <Link href="/register" onClick={() => setIsOpen(false)}>
                        Crear Cuenta
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  )
}
