"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, BookOpen, Clock } from "lucide-react"
import { useLanguage } from "@/lib/contexts/language-context"

interface Guide {
  id: string
  title: string
  slug: string
  category: string
  excerpt?: string
  tags?: string[]
  views: number
  createdAt: string
}

export default function GuidesPage() {
  const [guides, setGuides] = useState<Guide[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const { t } = useLanguage()

  useEffect(() => {
    fetchGuides()
  }, [])

  const fetchGuides = async () => {
    try {
      const response = await fetch('/api/guides')
      const data = await response.json()
      setGuides(data || [])
    } catch (error) {
      console.error('Error fetching guides:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    "Application Process",
    "Essay Writing",
    "Financial Aid",
    "Standardized Tests",
    "After Admission"
  ]

  const filteredGuides = guides.filter(guide => {
    const matchesSearch = !search ||
      guide.title.toLowerCase().includes(search.toLowerCase()) ||
      guide.excerpt?.toLowerCase().includes(search.toLowerCase())

    const matchesCategory = !selectedCategory || guide.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  // Helper to translate category
  const translateCategory = (cat: string) => {
    return t.guides.categories[cat as keyof typeof t.guides.categories] || cat
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">{t.guides.loading}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">{t.guides.title}</h1>
            <p className="text-xl text-muted-foreground mb-8">
              {t.guides.subtitle}
            </p>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder={t.guides.searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full transition-colors ${!selectedCategory
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
              }`}
          >
            {t.guides.allCategories}
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full transition-colors ${selectedCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
                }`}
            >
              {translateCategory(category)}
            </button>
          ))}
        </div>

        {/* Guides Grid */}
        {filteredGuides.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{t.guides.noResults}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuides.map((guide) => (
              <Link key={guide.id} href={`/guides/${guide.slug}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <Badge className="w-fit mb-2">{translateCategory(guide.category)}</Badge>
                    <CardTitle className="line-clamp-2 hover:text-primary transition-colors">
                      {guide.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {guide.excerpt && (
                      <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                        {guide.excerpt}
                      </p>
                    )}

                    {/* Tags */}
                    {guide.tags && guide.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {guide.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        5 {t.guides.readTime}
                      </div>
                      <div className="flex items-center gap-1">
                        👁 {guide.views} {t.guides.views}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

