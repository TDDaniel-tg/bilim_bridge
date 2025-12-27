"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/lib/contexts/language-context"
import { Card, CardContent } from "@/components/ui/card"
import { Award, Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default function AdminSuccessStoriesPage() {
  const { t } = useLanguage()
  const [stories, setStories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStories()
  }, [])

  const fetchStories = async () => {
    try {
      const res = await fetch('/api/success-stories')
      const data = await res.json()
      setStories(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return
    try {
      await fetch(`/api/success-stories/${id}`, { method: 'DELETE' })
      setStories(stories.filter(s => s.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">{t.admin.nav.successStories}</h1>
          <p className="text-muted-foreground">
            {t.admin.dashboard.subtitle}
          </p>
        </div>
        <Link href="/admin/success-stories/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Story
          </Button>
        </Link>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : stories.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Stories Yet</h3>
            <p className="text-muted-foreground">
              Success stories management coming soon
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left p-4">Student</th>
                  <th className="text-left p-4">University</th>
                  <th className="text-left p-4">Major</th>
                  <th className="text-left p-4">Published</th>
                  <th className="text-right p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stories.map((story) => (
                  <tr key={story.id} className="border-b hover:bg-muted/50">
                    <td className="p-4 font-medium">{story.studentName}</td>
                    <td className="p-4">{story.university?.nameEn || '-'}</td>
                    <td className="p-4">{story.major}</td>
                    <td className="p-4">
                      <Badge variant={story.isPublished ? "default" : "secondary"}>
                        {story.isPublished ? "Yes" : "No"}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/success-stories/${story.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(story.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
