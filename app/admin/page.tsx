"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Users,
  GraduationCap,
  FileText,
  Award,
  TrendingUp,
  MessageSquare,
  Calendar
} from "lucide-react"
import { useLanguage } from "@/lib/contexts/language-context"

export default function AdminDashboardPage() {
  const { t } = useLanguage()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalUniversities: 0,
    totalPrograms: 0,
    totalGuides: 0,
    totalSuccessStories: 0,
    pendingConsultations: 0
  })

  useEffect(() => {
    // TODO: Fetch real stats from API
    setStats({
      totalUsers: 150,
      totalUniversities: 5,
      totalPrograms: 0,
      totalGuides: 2,
      totalSuccessStories: 0,
      pendingConsultations: 0
    })
  }, [])

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t.admin.dashboard.title}</h1>
        <p className="text-muted-foreground">
          {t.admin.dashboard.subtitle}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.admin.dashboard.stats.totalUsers}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {t.admin.dashboard.stats.registeredStudents}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.admin.dashboard.stats.totalUniversities}</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUniversities}</div>
            <p className="text-xs text-muted-foreground">
              {t.admin.dashboard.stats.inDatabase}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.admin.dashboard.stats.totalPrograms}</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPrograms}</div>
            <p className="text-xs text-muted-foreground">
              {t.admin.dashboard.stats.summerHackathons}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.admin.dashboard.stats.totalGuides}</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalGuides}</div>
            <p className="text-xs text-muted-foreground">
              {t.admin.dashboard.stats.publishedArticles}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/admin/universities">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                {t.admin.dashboard.quickActions.manageUniversities}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t.admin.dashboard.quickActions.manageUniversitiesDesc}
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/users">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {t.admin.dashboard.quickActions.manageUsers}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t.admin.dashboard.quickActions.manageUsersDesc}
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/programs">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                {t.admin.dashboard.quickActions.managePrograms}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t.admin.dashboard.quickActions.manageProgramsDesc}
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/guides">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {t.admin.dashboard.quickActions.manageGuides}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t.admin.dashboard.quickActions.manageGuidesDesc}
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/success-stories">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                {t.admin.dashboard.quickActions.successStories}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t.admin.dashboard.quickActions.successStoriesDesc}
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/consultations">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {t.admin.dashboard.quickActions.consultations}
                {stats.pendingConsultations > 0 && (
                  <span className="ml-auto bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                    {stats.pendingConsultations}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t.admin.dashboard.quickActions.consultationsDesc}
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}

