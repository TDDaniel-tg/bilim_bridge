"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Download, Share2, Plus } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

// Обёртка для Suspense
export default function ComparePage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading comparison...</p>
      </div>
    }>
      <CompareContent />
    </Suspense>
  )
}


interface University {
  id: string
  nameEn: string
  country: string
  city: string
  logo?: string
  qsRanking?: number
  usNewsRanking?: number
  acceptanceRate?: number
  minGpa?: number
  avgGpa?: number
  avgSat25?: number
  avgSat75?: number
  minIelts?: number
  minToefl?: number
  tuitionIntl?: number
  roomBoard?: number
  totalCost?: number
  hasMeritScholarships?: boolean
  hasNeedBased?: boolean
  hasFullRide?: boolean
  totalStudents?: number
  studentFacultyRatio?: string
  employmentRate?: number
  avgSalary?: number
  regularDeadline?: string
  earlyActionDate?: string
  edDeadline?: string
  acceptsCommonApp?: boolean
}

function CompareContent() {
  const searchParams = useSearchParams()
  const [universities, setUniversities] = useState<University[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const ids = searchParams.get('ids')?.split(',') || []
    if (ids.length > 0) {
      fetchUniversities(ids)
    } else {
      setLoading(false)
    }
  }, [searchParams])

  const fetchUniversities = async (ids: string[]) => {
    try {
      const promises = ids.map(id =>
        fetch(`/api/universities/${id}`).then(res => res.json())
      )
      const data = await Promise.all(promises)
      setUniversities(data)
    } catch (error) {
      console.error('Error fetching universities:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeUniversity = (id: string) => {
    const newUniversities = universities.filter(u => u.id !== id)
    setUniversities(newUniversities)

    // Update URL
    const newIds = newUniversities.map(u => u.id).join(',')
    window.history.pushState({}, '', `/universities/compare?ids=${newIds}`)
  }

  const getBestValue = (values: (number | undefined)[], higher: boolean = true) => {
    const validValues = values.filter(v => v !== undefined) as number[]
    if (validValues.length === 0) return undefined
    return higher ? Math.max(...validValues) : Math.min(...validValues)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading comparison...</p>
      </div>
    )
  }

  if (universities.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardContent className="py-12 text-center">
            <h2 className="text-2xl font-bold mb-2">No Universities to Compare</h2>
            <p className="text-muted-foreground mb-6">
              Select universities from the search page to compare them
            </p>
            <Link href="/universities">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Browse Universities
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const acceptanceRates = universities.map(u => u.acceptanceRate)
  const costs = universities.map(u => u.totalCost)
  const rankings = universities.map(u => u.qsRanking)

  const bestAcceptanceRate = getBestValue(acceptanceRates, true)
  const bestCost = getBestValue(costs, false)
  const bestRanking = getBestValue(rankings, false)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-muted/50 py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Compare Universities</h1>
              <p className="text-muted-foreground">
                Comparing {universities.length} {universities.length === 1 ? 'university' : 'universities'}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="container mx-auto px-4 py-8">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="sticky left-0 bg-background p-4 text-left font-semibold border-b min-w-[200px]">
                  Parameter
                </th>
                {universities.map((uni) => (
                  <th key={uni.id} className="p-4 border-b min-w-[250px]">
                    <div className="flex flex-col items-center gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeUniversity(uni.id)}
                        className="ml-auto"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      {uni.logo && (
                        <div className="relative w-16 h-16">
                          <Image
                            src={uni.logo}
                            alt={uni.nameEn}
                            fill
                            className="object-contain"
                          />
                        </div>
                      )}
                      <div className="text-center">
                        <Link href={`/universities/${uni.id}`}>
                          <h3 className="font-semibold hover:text-primary transition-colors">
                            {uni.nameEn}
                          </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {uni.city}, {uni.country}
                        </p>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {/* Rankings */}
              <tr className="bg-muted/30">
                <td colSpan={universities.length + 1} className="p-4 font-semibold">
                  Rankings
                </td>
              </tr>
              <tr>
                <td className="sticky left-0 bg-background p-4 border-b">QS Ranking</td>
                {universities.map((uni) => (
                  <td key={uni.id} className="p-4 border-b text-center">
                    {uni.qsRanking ? (
                      <Badge className={uni.qsRanking === bestRanking ? 'bg-green-600' : ''}>
                        #{uni.qsRanking}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="sticky left-0 bg-background p-4 border-b">US News Ranking</td>
                {universities.map((uni) => (
                  <td key={uni.id} className="p-4 border-b text-center">
                    {uni.usNewsRanking ? (
                      <Badge variant="secondary">#{uni.usNewsRanking}</Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Admissions */}
              <tr className="bg-muted/30">
                <td colSpan={universities.length + 1} className="p-4 font-semibold">
                  Admissions
                </td>
              </tr>
              <tr>
                <td className="sticky left-0 bg-background p-4 border-b">Acceptance Rate</td>
                {universities.map((uni) => (
                  <td key={uni.id} className="p-4 border-b text-center">
                    {uni.acceptanceRate ? (
                      <span className={uni.acceptanceRate === bestAcceptanceRate ? 'font-bold text-green-600' : ''}>
                        {uni.acceptanceRate}%
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="sticky left-0 bg-background p-4 border-b">Average GPA</td>
                {universities.map((uni) => (
                  <td key={uni.id} className="p-4 border-b text-center">
                    {uni.avgGpa ? uni.avgGpa.toFixed(2) : '-'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="sticky left-0 bg-background p-4 border-b">SAT Range</td>
                {universities.map((uni) => (
                  <td key={uni.id} className="p-4 border-b text-center">
                    {uni.avgSat25 && uni.avgSat75
                      ? `${uni.avgSat25} - ${uni.avgSat75}`
                      : '-'
                    }
                  </td>
                ))}
              </tr>
              <tr>
                <td className="sticky left-0 bg-background p-4 border-b">Min IELTS</td>
                {universities.map((uni) => (
                  <td key={uni.id} className="p-4 border-b text-center">
                    {uni.minIelts || '-'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="sticky left-0 bg-background p-4 border-b">Min TOEFL</td>
                {universities.map((uni) => (
                  <td key={uni.id} className="p-4 border-b text-center">
                    {uni.minToefl || '-'}
                  </td>
                ))}
              </tr>

              {/* Financial */}
              <tr className="bg-muted/30">
                <td colSpan={universities.length + 1} className="p-4 font-semibold">
                  Cost & Financial Aid
                </td>
              </tr>
              <tr>
                <td className="sticky left-0 bg-background p-4 border-b">Tuition</td>
                {universities.map((uni) => (
                  <td key={uni.id} className="p-4 border-b text-center">
                    {uni.tuitionIntl ? formatCurrency(uni.tuitionIntl) : '-'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="sticky left-0 bg-background p-4 border-b">Total Cost/Year</td>
                {universities.map((uni) => (
                  <td key={uni.id} className="p-4 border-b text-center">
                    {uni.totalCost ? (
                      <span className={uni.totalCost === bestCost ? 'font-bold text-green-600' : ''}>
                        {formatCurrency(uni.totalCost)}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="sticky left-0 bg-background p-4 border-b">Merit Scholarships</td>
                {universities.map((uni) => (
                  <td key={uni.id} className="p-4 border-b text-center">
                    {uni.hasMeritScholarships ? '✓' : '✗'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="sticky left-0 bg-background p-4 border-b">Need-based Aid</td>
                {universities.map((uni) => (
                  <td key={uni.id} className="p-4 border-b text-center">
                    {uni.hasNeedBased ? '✓' : '✗'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="sticky left-0 bg-background p-4 border-b">Full-ride Available</td>
                {universities.map((uni) => (
                  <td key={uni.id} className="p-4 border-b text-center">
                    {uni.hasFullRide ? '✓' : '✗'}
                  </td>
                ))}
              </tr>

              {/* Statistics */}
              <tr className="bg-muted/30">
                <td colSpan={universities.length + 1} className="p-4 font-semibold">
                  Statistics
                </td>
              </tr>
              <tr>
                <td className="sticky left-0 bg-background p-4 border-b">Total Students</td>
                {universities.map((uni) => (
                  <td key={uni.id} className="p-4 border-b text-center">
                    {uni.totalStudents?.toLocaleString() || '-'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="sticky left-0 bg-background p-4 border-b">Student-Faculty Ratio</td>
                {universities.map((uni) => (
                  <td key={uni.id} className="p-4 border-b text-center">
                    {uni.studentFacultyRatio || '-'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="sticky left-0 bg-background p-4 border-b">Employment Rate</td>
                {universities.map((uni) => (
                  <td key={uni.id} className="p-4 border-b text-center">
                    {uni.employmentRate ? `${uni.employmentRate}%` : '-'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="sticky left-0 bg-background p-4 border-b">Average Salary</td>
                {universities.map((uni) => (
                  <td key={uni.id} className="p-4 border-b text-center">
                    {uni.avgSalary ? formatCurrency(uni.avgSalary) : '-'}
                  </td>
                ))}
              </tr>

              {/* Application */}
              <tr className="bg-muted/30">
                <td colSpan={universities.length + 1} className="p-4 font-semibold">
                  Application
                </td>
              </tr>
              <tr>
                <td className="sticky left-0 bg-background p-4 border-b">Common App</td>
                {universities.map((uni) => (
                  <td key={uni.id} className="p-4 border-b text-center">
                    {uni.acceptsCommonApp ? '✓' : '✗'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="sticky left-0 bg-background p-4 border-b">Regular Deadline</td>
                {universities.map((uni) => (
                  <td key={uni.id} className="p-4 border-b text-center">
                    {uni.regularDeadline
                      ? new Date(uni.regularDeadline).toLocaleDateString()
                      : '-'
                    }
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

