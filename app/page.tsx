import { Header } from "@/components/liken/header"
import { Hero } from "@/components/liken/hero"
import { Features } from "@/components/liken/features"
import { Projects } from "@/components/liken/projects"
import { Tokenomics } from "@/components/liken/tokenomics"
import { CTA } from "@/components/liken/cta"
import { Footer } from "@/components/liken/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <Projects />
      <Tokenomics />
      <CTA />
      <Footer />
    </main>
  )
}
