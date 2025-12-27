"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Sparkles } from "lucide-react"
import { useLanguage } from "@/lib/contexts/language-context"

export function HeroSection() {
  const { t } = useLanguage()

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-radial" />

      {/* Animated gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <Badge className="mx-auto bg-gradient-primary border-0 text-white">
            <Sparkles className="mr-2 h-3 w-3" />
            {t.home.hero.badge}
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="text-gradient-primary">
              {t.home.hero.titlePart1}
            </span>
            <br />
            <span className="text-foreground">
              {t.home.hero.titlePart2}
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t.home.hero.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/auth">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-primary hover:opacity-90 text-white border-0 px-8 text-base">
                {t.home.hero.cta}
              </Button>
            </Link>
            <Link href="/universities">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 px-8 text-base">
                <Search className="mr-2 h-4 w-4" />
                {t.home.hero.search} {t.home.hero.universities}
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 pt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-primary border-2 border-background" />
                ))}
              </div>
              <span>{t.home.hero.trust.students}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-500">★★★★★</span>
              <span>{t.home.hero.trust.rating}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🎓</span>
              <span>{t.home.hero.trust.universities}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

