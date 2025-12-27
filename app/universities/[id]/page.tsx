"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  MapPin, DollarSign, Users, TrendingUp, Calendar,
  Award, BookOpen, Briefcase, Heart, Calculator, Share2
} from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"
import { useLanguage } from "@/lib/contexts/language-context"

export default function UniversityDetailPage() {
  const params = useParams()
  const [university, setUniversity] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const { t } = useLanguage()

  useEffect(() => {
    fetchUniversity()
  }, [params.id])

  const fetchUniversity = async () => {
    try {
      const response = await fetch(`/api/universities/${params.id}`)
      const data = await response.json()
      setUniversity(data)
    } catch (error) {
      console.error('Error fetching university:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">{t.common.loading}</p>
      </div>
    )
  }

  if (!university) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground">{t.universities.noResults}</p>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: t.universityDetail.tabs.overview },
    { id: 'admissions', label: t.universityDetail.tabs.admissions },
    { id: 'financial', label: t.universityDetail.tabs.financial },
    // { id: 'academics', label: t.universityDetail.tabs.academics }, // Assuming this data isn't ready yet based on original code structure
    // { id: 'campus', label: t.universityDetail.tabs.campus },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {university.logo && (
              <div className="relative w-24 h-24 bg-white rounded-lg p-2 shadow-md">
                <Image
                  src={university.logo}
                  alt={university.nameEn}
                  fill
                  className="object-contain"
                />
              </div>
            )}

            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{university.nameEn}</h1>
              {university.nameRu && (
                <p className="text-xl text-muted-foreground mb-3">{university.nameRu}</p>
              )}
              {university.motto && (
                <p className="italic text-muted-foreground mb-4">"{university.motto}"</p>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {university.city}, {university.country}
                </Badge>
                {university.qsRanking && (
                  <Badge className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {t.universities.card.qs.replace('{rank}', university.qsRanking.toString())}
                  </Badge>
                )}
                {university.acceptanceRate && (
                  <Badge variant="outline">
                    {t.universities.card.acceptance.replace('{rate}', university.acceptanceRate.toString())}
                  </Badge>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 w-full md:w-auto">
              <Button className="w-full md:w-40">
                <Heart className="h-4 w-4 mr-2" />
                {t.universityDetail.actions.save}
              </Button>
              <Button variant="outline" className="w-full md:w-40">
                <Calculator className="h-4 w-4 mr-2" />
                {t.universityDetail.actions.fitScore}
              </Button>
              <Button variant="outline" className="w-full md:w-40">
                <Share2 className="h-4 w-4 mr-2" />
                {t.universityDetail.actions.share}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                    ? 'border-primary text-primary font-medium'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t.universityDetail.overview.about}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {university.nameEn} is a leading institution located in {university.city}, {university.country}.
                  </p>
                </CardContent>
              </Card>

              {university.qsRanking && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t.universityDetail.overview.ranking}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {university.qsRanking && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">QS World Ranking</span>
                        <Badge>#{university.qsRanking}</Badge>
                      </div>
                    )}
                    {university.usNewsRanking && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">US News Ranking</span>
                        <Badge>#{university.usNewsRanking}</Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t.universityDetail.overview.quickFacts}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {university.totalStudents && (
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">{university.totalStudents.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">{t.universityDetail.overview.students}</p>
                      </div>
                    </div>
                  )}
                  {university.tuitionIntl && (
                    <div className="flex items-start gap-3">
                      <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">{formatCurrency(university.tuitionIntl)}</p>
                        <p className="text-sm text-muted-foreground">{t.universityDetail.financial.tuition}</p>
                      </div>
                    </div>
                  )}
                  {university.acceptanceRate && (
                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">{university.acceptanceRate}%</p>
                        <p className="text-sm text-muted-foreground">{t.universityDetail.admissions.acceptanceRate}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {(university.hasFullRide || university.hasMeritScholarships || university.hasNeedBased) && (
                <Card className="bg-green-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-800">
                      <Award className="h-5 w-5" />
                      {t.universityDetail.financial.scholarships}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-green-800">
                      {university.hasFullRide && <li>• {t.universityDetail.financial.fullRide}</li>}
                      {university.hasMeritScholarships && <li>• {t.universityDetail.financial.meritBased}</li>}
                      {university.hasNeedBased && <li>• {t.universityDetail.financial.needBased}</li>}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {activeTab === 'admissions' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t.universityDetail.admissions.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {university.minGpa && (
                  <div>
                    <p className="text-sm text-muted-foreground">{t.universityDetail.admissions.gpa}</p>
                    <p className="font-semibold">{university.minGpa.toFixed(2)}</p>
                  </div>
                )}
                {university.avgGpa && (
                  <div>
                    <p className="text-sm text-muted-foreground">Average GPA (Admitted)</p>
                    <p className="font-semibold">{university.avgGpa.toFixed(2)}</p>
                  </div>
                )}
                {(university.avgSat25 && university.avgSat75) && (
                  <div>
                    <p className="text-sm text-muted-foreground">SAT Score Range</p>
                    <p className="font-semibold">{university.avgSat25} - {university.avgSat75}</p>
                  </div>
                )}
                {university.minIelts && (
                  <div>
                    <p className="text-sm text-muted-foreground">{t.universityDetail.admissions.ielts}</p>
                    <p className="font-semibold">{university.minIelts}</p>
                  </div>
                )}
                {university.minToefl && (
                  <div>
                    <p className="text-sm text-muted-foreground">{t.universityDetail.admissions.toefl}</p>
                    <p className="font-semibold">{university.minToefl}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t.universityDetail.admissions.deadlines}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {university.earlyActionDate && (
                  <div>
                    <p className="text-sm text-muted-foreground">Early Action</p>
                    <p className="font-semibold">{formatDate(university.earlyActionDate)}</p>
                  </div>
                )}
                {university.edDeadline && (
                  <div>
                    <p className="text-sm text-muted-foreground">Early Decision</p>
                    <p className="font-semibold">{formatDate(university.edDeadline)}</p>
                  </div>
                )}
                {university.regularDeadline && (
                  <div>
                    <p className="text-sm text-muted-foreground">Regular Decision</p>
                    <p className="font-semibold">{formatDate(university.regularDeadline)}</p>
                  </div>
                )}
                {university.hasRolling && (
                  <div>
                    <Badge variant="secondary">Rolling Admissions</Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'financial' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t.universityDetail.financial.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {university.tuitionIntl && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">{t.universityDetail.financial.tuition}</span>
                    <span className="font-semibold">{formatCurrency(university.tuitionIntl)}</span>
                  </div>
                )}
                {university.roomBoard && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">{t.universityDetail.financial.roomBoard}</span>
                    <span className="font-semibold">{formatCurrency(university.roomBoard)}</span>
                  </div>
                )}
                {university.otherFees && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Other Fees</span>
                    <span className="font-semibold">{formatCurrency(university.otherFees)}</span>
                  </div>
                )}
                {university.totalCost && (
                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="font-semibold">{t.universityDetail.financial.totalCost}</span>
                    <span className="font-bold text-lg">{formatCurrency(university.totalCost)}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t.universityDetail.financial.scholarships}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {university.hasMeritScholarships && (
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="font-semibold text-green-800">{t.universityDetail.financial.meritBased}</p>
                      <p className="text-sm text-green-700 mt-1">Available for high-achieving students</p>
                    </div>
                  )}
                  {university.hasNeedBased && (
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="font-semibold text-blue-800">{t.universityDetail.financial.needBased}</p>
                      <p className="text-sm text-blue-700 mt-1">Based on family financial situation</p>
                    </div>
                  )}
                  {university.hasFullRide && (
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <p className="font-semibold text-purple-800">{t.universityDetail.financial.fullRide}</p>
                      <p className="text-sm text-purple-700 mt-1">Covers full tuition, room, and board</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Apply CTA */}
      <div className="border-t bg-muted/50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold mb-1">{t.universityDetail.apply.title}</h3>
              <p className="text-muted-foreground">{t.universityDetail.apply.subtitle} {university.nameEn}</p>
            </div>
            <div className="flex gap-3">
              {university.website && (
                <a href={university.website} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline">{t.universityDetail.apply.visitWebsite}</Button>
                </a>
              )}
              {university.admissionPage && (
                <a href={university.admissionPage} target="_blank" rel="noopener noreferrer">
                  <Button>{t.universityDetail.apply.applyNow}</Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

