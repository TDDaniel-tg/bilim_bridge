"use client"

import { useEffect, useState } from "react"
import dynamic from 'next/dynamic'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, List } from "lucide-react"

// Динамически импортируем карту (только на клиенте)
const MapComponent = dynamic(() => import('@/components/universities/university-map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] flex items-center justify-center bg-muted">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    </div>
  )
})

interface University {
  id: string
  nameEn: string
  country: string
  city: string
  latitude?: number
  longitude?: number
  logo?: string
  qsRanking?: number
  acceptanceRate?: number
}

export default function UniversityMapPage() {
  const [universities, setUniversities] = useState<University[]>([])
  const [filteredUniversities, setFilteredUniversities] = useState<University[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)

  useEffect(() => {
    fetchUniversities()
  }, [])

  useEffect(() => {
    filterUniversities()
  }, [search, selectedCountry, universities])

  const fetchUniversities = async () => {
    try {
      const response = await fetch('/api/universities?limit=100')
      const data = await response.json()
      // Фильтруем только университеты с координатами
      const withCoords = data.universities.filter((u: University) => u.latitude && u.longitude)
      setUniversities(withCoords)
      setFilteredUniversities(withCoords)
    } catch (error) {
      console.error('Error fetching universities:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterUniversities = () => {
    let filtered = universities

    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(u => 
        u.nameEn.toLowerCase().includes(searchLower) ||
        u.city.toLowerCase().includes(searchLower) ||
        u.country.toLowerCase().includes(searchLower)
      )
    }

    if (selectedCountry) {
      filtered = filtered.filter(u => u.country === selectedCountry)
    }

    setFilteredUniversities(filtered)
  }

  const countries = Array.from(new Set(universities.map(u => u.country))).sort()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-muted/50 py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4">University Map</h1>
          
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search universities, cities, or countries..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <select
              className="px-4 py-2 border rounded-md bg-background"
              value={selectedCountry || ''}
              onChange={(e) => setSelectedCountry(e.target.value || null)}
            >
              <option value="">All Countries</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>

            <Button
              variant="outline"
              onClick={() => {
                setSearch("")
                setSelectedCountry(null)
              }}
            >
              Clear Filters
            </Button>

            <Button variant="outline" asChild>
              <a href="/universities">
                <List className="h-4 w-4 mr-2" />
                List View
              </a>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            Showing {filteredUniversities.length} of {universities.length} universities
          </p>
        </div>
      </div>

      {/* Map */}
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="w-full h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading universities...</p>
                </div>
              </div>
            ) : (
              <MapComponent universities={filteredUniversities} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

