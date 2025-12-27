"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Award, TrendingUp } from "lucide-react"
import { useLanguage } from "@/lib/contexts/language-context"

interface SuccessStory {
  id: string
  studentName: string
  studentPhoto?: string
  major: string
  admissionYear: number
  originCountry: string
  gpa?: number
  satScore?: number
  ieltsScore?: number
  finAidReceived?: number
  university: {
    nameEn: string
    logo?: string
    country: string
  }
}

export default function SuccessStoriesPage() {
  const [stories, setStories] = useState<SuccessStory[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState({})
  const { t } = useLanguage()

  useEffect(() => {
    fetchStories()
  }, [filters])

  const fetchStories = async () => {
    try {
      const params = new URLSearchParams(filters as any)
      const response = await fetch(`/api/success-stories?${params}`)
      const data = await response.json()
      setStories(data || [])
    } catch (error) {
      console.error('Error fetching success stories:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredStories = stories.filter(story => {
    if (!search) return true
    const searchLower = search.toLowerCase()
    return (
      story.studentName.toLowerCase().includes(searchLower) ||
      story.university.nameEn.toLowerCase().includes(searchLower) ||
      story.major.toLowerCase().includes(searchLower)
    )
  })

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">{t.successStories.loading}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Award className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">{t.successStories.title}</h1>
            <p className="text-xl text-muted-foreground mb-8">
              {t.successStories.subtitle}
            </p>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder={t.successStories.searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {filteredStories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t.successStories.noResults}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStories.map((story) => (
              <Link key={story.id} href={`/success-stories/${story.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      {story.studentPhoto && (
                        <div className="relative w-16 h-16 rounded-full overflow-hidden">
                          <Image
                            src={story.studentPhoto}
                            alt={story.studentName}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{story.studentName}</h3>
                        <p className="text-sm text-muted-foreground">{story.originCountry}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      {story.university.logo && (
                        <div className="relative w-8 h-8">
                          <Image
                            src={story.university.logo}
                            alt={story.university.nameEn}
                            fill
                            className="object-contain"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{story.university.nameEn}</p>
                        <p className="text-xs text-muted-foreground">{story.major}</p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Academic Stats */}
                    <div className="grid grid-cols-3 gap-2 text-center">
                      {story.gpa && (
                        <div>
                          <p className="text-lg font-bold">{story.gpa.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">{t.successStories.gpa}</p>
                        </div>
                      )}
                      {story.satScore && (
                        <div>
                          <p className="text-lg font-bold">{story.satScore}</p>
                          <p className="text-xs text-muted-foreground">{t.successStories.sat}</p>
                        </div>
                      )}
                      {story.ieltsScore && (
                        <div>
                          <p className="text-lg font-bold">{story.ieltsScore}</p>
                          <p className="text-xs text-muted-foreground">{t.successStories.ielts}</p>
                        </div>
                      )}
                    </div>

                    {/* Financial Aid */}
                    {story.finAidReceived && story.finAidReceived > 0 && (
                      <div className="pt-4 border-t">
                        <Badge className="w-full justify-center bg-green-600">
                          <Award className="h-3 w-3 mr-1" />
                          ${story.finAidReceived.toLocaleString()} {t.successStories.financialAid}
                        </Badge>
                      </div>
                    )}

                    <Badge variant="outline" className="w-full justify-center">
                      {t.successStories.classOf} {story.admissionYear}
                    </Badge>
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

