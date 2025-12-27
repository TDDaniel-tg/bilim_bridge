"use client"

import { Card, CardContent } from "@/components/ui/card"
import { GraduationCap, Globe, Award, TrendingUp, Users, BookOpen } from "lucide-react"
import { useLanguage } from "@/lib/contexts/language-context"

export function StatsSection() {
  const { t } = useLanguage()

  const stats = [
    {
      icon: GraduationCap,
      value: "500+",
      label: t.home.stats.universities,
      color: "bg-blue-500",
    },
    {
      icon: Globe,
      value: "50+",
      label: t.home.stats.countries,
      color: "bg-purple-500",
    },
    {
      icon: Award,
      value: "10,000+",
      label: t.home.stats.students,
      color: "bg-orange-500",
    },
    {
      icon: TrendingUp,
      value: "95%",
      label: t.home.stats.successRate,
      color: "bg-green-500",
    },
    {
      icon: Users,
      value: "1,200+",
      label: t.home.stats.activeUsers,
      color: "bg-blue-500",
    },
    {
      icon: BookOpen,
      value: "$8M+",
      label: t.home.stats.scholarships,
      color: "bg-pink-500",
    },
  ]

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {t.home.stats.title} <span className="text-gradient-primary">{t.home.stats.titleHighlight}</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            {t.home.stats.description}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="card-glass border-2 hover:border-primary/50 transition-all duration-300 group">
                <CardContent className="pt-8 pb-8 text-center">
                  <div className={`${stat.color} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold mb-3 text-gradient-primary">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground font-medium">{stat.label}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

