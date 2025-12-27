"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Calendar, DollarSign, MapPin, Award } from "lucide-react"
import { formatCurrency, formatDate, calculateDaysUntil } from "@/lib/utils"
import { useLanguage } from "@/lib/contexts/language-context"

interface Program {
  id: string
  name: string
  organizer: string
  type: string
  country: string
  city: string
  format: string
  startDate: string
  endDate: string
  deadline: string
  cost?: number
  website?: string
}

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<string | null>(null)
  const { t } = useLanguage()

  useEffect(() => {
    fetchPrograms()
  }, [])

  const fetchPrograms = async () => {
    try {
      const response = await fetch('/api/programs')
      const data = await response.json()
      setPrograms(data || [])
    } catch (error) {
      console.error('Error fetching programs:', error)
    } finally {
      setLoading(false)
    }
  }

  const types = [
    { value: "SUMMER_SCHOOL", label: t.programs.summerSchool },
    { value: "HACKATHON", label: t.programs.hackathon },
    { value: "RESEARCH", label: t.programs.research },
    { value: "INTERNSHIP", label: t.programs.internship }
  ]

  const filteredPrograms = programs.filter(program => {
    const matchesSearch = !search ||
      program.name.toLowerCase().includes(search.toLowerCase()) ||
      program.organizer.toLowerCase().includes(search.toLowerCase())

    const matchesType = !typeFilter || program.type === typeFilter

    return matchesSearch && matchesType
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case "SUMMER_SCHOOL": return "bg-blue-100 text-blue-800"
      case "HACKATHON": return "bg-purple-100 text-purple-800"
      case "RESEARCH": return "bg-green-100 text-green-800"
      case "INTERNSHIP": return "bg-orange-100 text-orange-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeLabel = (type: string) => {
    return types.find(t => t.value === type)?.label || type
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">{t.programs.loading}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">{t.programs.title}</h1>
            <p className="text-xl text-muted-foreground mb-8">
              {t.programs.subtitle}
            </p>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder={t.programs.searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Type Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setTypeFilter(null)}
            className={`px-4 py-2 rounded-full transition-colors ${!typeFilter
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
              }`}
          >
            {t.programs.all}
          </button>
          {types.map((type) => (
            <button
              key={type.value}
              onClick={() => setTypeFilter(type.value)}
              className={`px-4 py-2 rounded-full transition-colors ${typeFilter === type.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
                }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Programs Grid */}
        {filteredPrograms.length === 0 ? (
          <div className="text-center py-12">
            <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{t.programs.noResults}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.map((program) => {
              const daysUntilDeadline = calculateDaysUntil(program.deadline)
              const isDeadlineSoon = daysUntilDeadline > 0 && daysUntilDeadline <= 14

              return (
                <Card key={program.id} className="flex flex-col h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Badge className={getTypeColor(program.type)}>
                        {getTypeLabel(program.type)}
                      </Badge>
                      {isDeadlineSoon && (
                        <Badge variant="destructive" className="animate-pulse">
                          {t.programs.deadlineSoon}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="line-clamp-2">
                      {program.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {t.programs.by} {program.organizer}
                    </p>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col gap-4">
                    {/* Location */}
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{program.city}, {program.country}</span>
                      <Badge variant="outline" className="ml-auto">
                        {program.format}
                      </Badge>
                    </div>

                    {/* Dates */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{t.programs.program}:</span>
                        <span>{formatDate(program.startDate)} - {formatDate(program.endDate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{t.programs.deadline}:</span>
                        <span className={isDeadlineSoon ? 'text-red-600 font-semibold' : ''}>
                          {formatDate(program.deadline)}
                          {' '}{daysUntilDeadline > 0 && t.programs.days.replace('{days}', daysUntilDeadline.toString())}
                        </span>
                      </div>
                    </div>

                    {/* Cost */}
                    {program.cost !== undefined && (
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        {program.cost === 0 ? (
                          <Badge className="bg-green-600">{t.programs.free}</Badge>
                        ) : (
                          formatCurrency(program.cost)
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 mt-auto pt-4">
                      <Link href={`/programs/${program.id}`} className="flex-1">
                        <Button variant="outline" className="w-full" size="sm">
                          {t.programs.details}
                        </Button>
                      </Link>
                      {program.website && (
                        <a href={program.website} target="_blank" rel="noopener noreferrer" className="flex-1">
                          <Button className="w-full" size="sm">
                            {t.programs.apply}
                          </Button>
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

