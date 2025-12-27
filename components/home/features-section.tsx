"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  MessageSquare,
  Search,
  Calculator,
  CheckCircle,
  Globe,
  TrendingUp,
  Sparkles,
  Target
} from "lucide-react"
import { useLanguage } from "@/lib/contexts/language-context"

export function FeaturesSection() {
  const { t } = useLanguage()

  const features = [
    {
      icon: MessageSquare,
      title: t.home.features.aiAssistant.title,
      description: t.home.features.aiAssistant.description,
      color: "bg-blue-500",
      badge: "AI"
    },
    {
      icon: Search,
      title: t.home.features.smartSearch.title,
      description: t.home.features.smartSearch.description,
      color: "bg-purple-500",
      badge: "NEW"
    },
    {
      icon: Calculator,
      title: t.home.features.fitScore.title,
      description: t.home.features.fitScore.description,
      color: "bg-orange-500",
      badge: "SMART"
    },
    {
      icon: CheckCircle,
      title: t.home.features.checklists.title,
      description: t.home.features.checklists.description,
      color: "bg-green-500",
      badge: "FREE"
    },
    {
      icon: Globe,
      title: t.home.features.map.title,
      description: t.home.features.map.description,
      color: "bg-blue-500",
      badge: "MAP"
    },
    {
      icon: TrendingUp,
      title: t.home.features.comparison.title,
      description: t.home.features.comparison.description,
      color: "bg-pink-500",
      badge: "PRO"
    },
  ]

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="outline" className="mb-4">
            <Sparkles className="mr-2 h-3 w-3" />
            {t.home.features.badge}
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold">
            {t.home.features.title}
            <br />
            <span className="text-gradient-primary">{t.home.features.titleHighlight}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t.home.features.description}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="card-glass border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`${feature.color} p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

