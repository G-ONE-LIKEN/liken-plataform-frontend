"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Zap } from "lucide-react"
import { useSession } from "@/providers/session-provider"

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
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">LIKEN</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-4 lg:flex">
          {user ? (
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
              <Link href="/dashboard">Mi Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground" asChild>
                <Link href="/login">Iniciar Sesión</Link>
              </Button>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                <Link href="/register">Comenzar</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Abrir menú</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 bg-card">
            <div className="flex flex-col gap-6 pt-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium text-foreground"
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex flex-col gap-3 pt-4">
                {user ? (
                  <Button className="w-full bg-primary text-primary-foreground" asChild>
                    <Link href="/dashboard" onClick={() => setIsOpen(false)}>Mi Dashboard</Link>
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/login" onClick={() => setIsOpen(false)}>Iniciar Sesión</Link>
                    </Button>
                    <Button className="w-full bg-primary text-primary-foreground" asChild>
                      <Link href="/register" onClick={() => setIsOpen(false)}>Comenzar</Link>
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
