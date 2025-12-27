"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import { useLanguage } from "@/lib/contexts/language-context"

export function CTASection() {
  const { t } = useLanguage()

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700" />

      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/50 to-pink-600/50 animate-gradient" />

      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-white/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            {t.home.cta.badge}
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-white">
            {t.home.cta.titlePart1}
            <br />
            {t.home.cta.titlePart2}
          </h2>

          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            {t.home.cta.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/auth">
              <Button size="lg" className="w-full sm:w-auto bg-white text-purple-600 hover:bg-white/90 px-8 text-base font-semibold">
                {t.home.cta.buttonPrimary}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/universities">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-white text-white hover:bg-white/10 px-8 text-base font-semibold">
                {t.home.cta.buttonSecondary}
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 pt-8 text-white/80">
            <div>{t.home.cta.trust.free}</div>
            <div>{t.home.cta.trust.hidden}</div>
            <div>{t.home.cta.trust.cancel}</div>
          </div>
        </div>
      </div>
    </section>
  )
}

