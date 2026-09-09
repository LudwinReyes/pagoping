import { Navbar } from "@/components/landing/navbar"
import { Hero } from "@/components/landing/hero"
import { StatsCounter } from "@/components/landing/stats-counter"
import { InteractiveSimulator } from "@/components/landing/interactive-simulator"
import { FeaturesBento } from "@/components/landing/features-bento"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Comparison } from "@/components/landing/comparison"
import { Pricing } from "@/components/landing/pricing"
import { FAQ } from "@/components/landing/faq"
import { CTASection } from "@/components/landing/cta-section"
import { Footer } from "@/components/landing/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <StatsCounter />
        <InteractiveSimulator />
        <FeaturesBento />
        <HowItWorks />
        <Comparison />
        <Pricing />
        <FAQ />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
