"use client"

import { useState, useEffect } from "react"
import { UniversityCard } from "@/components/universities/university-card"
import { UniversityFilters } from "@/components/universities/university-filters"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Grid, List, Map } from "lucide-react"
import { useLanguage } from "@/lib/contexts/language-context"

interface University {
  id: string
  nameEn: string
  country: string
  city: string
  logo?: string | null
  qsRanking?: number | null
  acceptanceRate?: number | null
  tuitionIntl?: number | null
  hasFullRide?: boolean
  hasMeritScholarships?: boolean
}

export default function UniversitiesPage() {
  const [universities, setUniversities] = useState<University[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState({})
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const { t } = useLanguage()

  useEffect(() => {
    fetchUniversities()
  }, [filters, page])

  const fetchUniversities = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        ...filters,
        page: page.toString(),
        limit: '20'
      } as any)

      const response = await fetch(`/api/universities?${params}`)
      const data = await response.json()

      setUniversities(data.universities || [])
      setTotal(data.pagination?.total || 0)
    } catch (error) {
      console.error('Error fetching universities:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (search.trim()) {
      setFilters({ ...filters, search })
      setPage(1)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{t.universities.filters.findTitle}</h1>
        <p className="text-muted-foreground">
          {t.universities.filters.findSubtitle}
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8 flex gap-4">
        <div className="flex-1 flex gap-2">
          <Input
            placeholder={t.universities.filters.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1"
          />
          <Button onClick={handleSearch}>
            <Search className="h-4 w-4 mr-2" />
            {t.universities.filters.searchButton}
          </Button>
        </div>

        {/* View Toggle */}
        <div className="flex gap-1 border rounded-md p-1">
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:w-80 flex-shrink-0">
          <UniversityFilters
            onFilterChange={(newFilters) => {
              setFilters(newFilters)
              setPage(1)
            }}
            activeFilters={filters}
          />
        </aside>

        {/* Results */}
        <main className="flex-1">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">{t.universities.filters.loading}</p>
            </div>
          ) : universities.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t.universities.filters.noResults}</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setFilters({})
                  setSearch('')
                  setPage(1)
                }}
              >
                {t.universities.filters.clearFilters}
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {t.universities.filters.showing.replace('{count}', universities.length.toString()).replace('{total}', total.toString())}
                </p>
              </div>

              <div className={viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
                : 'space-y-4'
              }>
                {universities.map((university) => (
                  <UniversityCard
                    key={university.id}
                    university={university}
                  />
                ))}
              </div>

              {/* Pagination */}
              {total > 20 && (
                <div className="mt-8 flex justify-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    {t.universities.filters.previous}
                  </Button>
                  <span className="px-4 py-2 text-sm">
                    {t.universities.filters.page.replace('{page}', page.toString()).replace('{total}', Math.ceil(total / 20).toString())}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setPage(p => p + 1)}
                    disabled={page >= Math.ceil(total / 20)}
                  >
                    {t.universities.filters.next}
                  </Button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}

