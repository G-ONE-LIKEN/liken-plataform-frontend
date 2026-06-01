import { Header } from "@/components/liken/header"
import { Hero } from "@/components/liken/hero"
import { Features } from "@/components/liken/features"
import { HowItWorks } from "@/components/liken/how-it-works"
import { Projects } from "@/components/liken/projects"
import { Testimonials } from "@/components/liken/testimonials"
import { Tokenomics } from "@/components/liken/tokenomics"
import { CTA } from "@/components/liken/cta"
import { Footer } from "@/components/liken/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <Projects />
      <Testimonials />
      <Tokenomics />
      <CTA />
      <Footer />
    </main>
  )
}
