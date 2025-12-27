"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  GraduationCap, 
  Heart, 
  CheckCircle, 
  MessageSquare,
  TrendingUp,
  Calendar,
  Award,
  User
} from "lucide-react"

export default function DashboardPage() {
  // TODO: Get real data from authenticated user
  const stats = {
    favoriteCount: 0,
    checklistsComplete: 0,
    checklistsTotal: 0,
    upcomingDeadlines: 0
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
        <p className="text-muted-foreground">
          Track your application progress and manage your university selections
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Saved Universities
            </CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.favoriteCount}</div>
            <p className="text-xs text-muted-foreground">
              Universities in your list
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Checklist Progress
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.checklistsComplete}/{stats.checklistsTotal}
            </div>
            <p className="text-xs text-muted-foreground">
              Tasks completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Deadlines
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingDeadlines}</div>
            <p className="text-xs text-muted-foreground">
              In the next 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Profile Completion
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0%</div>
            <p className="text-xs text-muted-foreground">
              Complete your profile
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/universities">
              <Button className="w-full justify-start" variant="outline">
                <GraduationCap className="mr-2 h-4 w-4" />
                Search Universities
              </Button>
            </Link>
            <Link href="/dashboard/profile">
              <Button className="w-full justify-start" variant="outline">
                <User className="mr-2 h-4 w-4" />
                Complete Your Profile
              </Button>
            </Link>
            <Link href="/dashboard/checklists">
              <Button className="w-full justify-start" variant="outline">
                <CheckCircle className="mr-2 h-4 w-4" />
                View Checklists
              </Button>
            </Link>
            <Button className="w-full justify-start" variant="outline">
              <MessageSquare className="mr-2 h-4 w-4" />
              Chat with AI Assistant
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">
                1
              </div>
              <div>
                <p className="font-medium">Complete your profile</p>
                <p className="text-sm text-muted-foreground">
                  Add your academic information and test scores
                </p>
                <Link href="/dashboard/profile">
                  <Button variant="link" className="p-0 h-auto mt-1">
                    Start now →
                  </Button>
                </Link>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground text-sm">
                2
              </div>
              <div>
                <p className="font-medium">Find universities</p>
                <p className="text-sm text-muted-foreground">
                  Browse and save universities that match your profile
                </p>
                <Link href="/universities">
                  <Button variant="link" className="p-0 h-auto mt-1">
                    Search →
                  </Button>
                </Link>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground text-sm">
                3
              </div>
              <div>
                <p className="font-medium">Track your applications</p>
                <p className="text-sm text-muted-foreground">
                  Use checklists to manage deadlines and requirements
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Empty State */}
      <Card>
        <CardHeader>
          <CardTitle>Your Saved Universities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No universities saved yet</h3>
            <p className="text-muted-foreground mb-4">
              Start by searching for universities and adding them to your favorites
            </p>
            <Link href="/universities">
              <Button>
                <GraduationCap className="mr-2 h-4 w-4" />
                Browse Universities
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

