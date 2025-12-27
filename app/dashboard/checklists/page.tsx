"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Circle, Calendar } from "lucide-react"
import { formatDate, calculateDaysUntil } from "@/lib/utils"

interface Checklist {
  id: string
  university: {
    nameEn: string
    logo?: string
    regularDeadline?: string
  }
  progress: number
  completedItems: number
  totalItems: number
  items: ChecklistItem[]
}

interface ChecklistItem {
  id: string
  title: string
  status: string
  deadline?: string
}

export default function ChecklistsPage() {
  const [checklists, setChecklists] = useState<Checklist[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchChecklists()
  }, [])

  const fetchChecklists = async () => {
    try {
      // TODO: Add authentication header
      const response = await fetch('/api/checklists')
      if (response.ok) {
        const data = await response.json()
        setChecklists(data)
      }
    } catch (error) {
      console.error('Error fetching checklists:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading checklists...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Application Checklists</h1>
        <p className="text-muted-foreground">
          Track your progress for each university application
        </p>
      </div>

      {checklists.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <CheckCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No checklists yet</h3>
            <p className="text-muted-foreground mb-4">
              Add universities to your favorites to create checklists
            </p>
            <Link href="/universities">
              <Button>Browse Universities</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {checklists.map((checklist) => {
            const deadline = checklist.university.regularDeadline
            const daysUntil = deadline ? calculateDaysUntil(deadline) : null
            const isUrgent = daysUntil !== null && daysUntil > 0 && daysUntil <= 30

            return (
              <Link key={checklist.id} href={`/dashboard/checklists/${checklist.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-4">
                      {checklist.university.logo && (
                        <div className="relative w-12 h-12">
                          <Image
                            src={checklist.university.logo}
                            alt={checklist.university.nameEn}
                            fill
                            className="object-contain"
                          />
                        </div>
                      )}
                      <CardTitle className="flex-1 text-base line-clamp-2">
                        {checklist.university.nameEn}
                      </CardTitle>
                    </div>

                    {deadline && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className={isUrgent ? 'text-red-600 font-semibold' : 'text-muted-foreground'}>
                          {formatDate(deadline)}
                          {daysUntil !== null && daysUntil > 0 && (
                            <span className="ml-1">
                              ({daysUntil} days)
                            </span>
                          )}
                        </span>
                      </div>
                    )}
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-semibold">{checklist.progress}%</span>
                      </div>
                      <Progress value={checklist.progress} />
                      <p className="text-xs text-muted-foreground">
                        {checklist.completedItems} of {checklist.totalItems} tasks completed
                      </p>
                    </div>

                    {/* Recent tasks */}
                    <div className="space-y-2">
                      {checklist.items.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-start gap-2 text-sm">
                          {item.status === 'COMPLETED' ? (
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          ) : (
                            <Circle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          )}
                          <span className={`line-clamp-1 ${item.status === 'COMPLETED' ? 'text-muted-foreground line-through' : ''}`}>
                            {item.title}
                          </span>
                        </div>
                      ))}
                    </div>

                    {isUrgent && (
                      <Badge variant="destructive" className="w-full justify-center">
                        Deadline approaching!
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

