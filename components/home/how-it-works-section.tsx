"use client"

import { Card, CardContent } from "@/components/ui/card"
import {
  UserPlus,
  Search,
  FileCheck,
  Rocket,
  ArrowRight
} from "lucide-react"
import { useLanguage } from "@/lib/contexts/language-context"

export function HowItWorksSection() {
  const { t } = useLanguage()

  const steps = [
    {
      icon: UserPlus,
      number: "01",
      title: t.home.howItWorks.steps[1].title,
      description: t.home.howItWorks.steps[1].description,
      color: "bg-blue-500",
    },
    {
      icon: Search,
      number: "02",
      title: t.home.howItWorks.steps[2].title,
      description: t.home.howItWorks.steps[2].description,
      color: "bg-purple-500",
    },
    {
      icon: FileCheck,
      number: "03",
      title: t.home.howItWorks.steps[3].title,
      description: t.home.howItWorks.steps[3].description,
      color: "bg-orange-500",
    },
    {
      icon: Rocket,
      number: "04",
      title: t.home.howItWorks.steps[4].title,
      description: t.home.howItWorks.steps[4].description,
      color: "bg-green-500",
    },
  ]

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {t.home.howItWorks.title} <span className="text-gradient-primary">{t.home.howItWorks.titleHighlight}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t.home.howItWorks.description}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="relative">
                <Card className="card-glass border-2 hover:border-primary/50 transition-all duration-300 h-full group">
                  <CardContent className="pt-8 pb-8">
                    {/* Step number */}
                    <div className="text-6xl font-bold text-muted-foreground/20 mb-4">
                      {step.number}
                    </div>

                    {/* Icon */}
                    <div className={`${step.color} w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>

                {/* Arrow connector - hide on mobile and last item */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                    <ArrowRight className="h-8 w-8 text-primary/30" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

