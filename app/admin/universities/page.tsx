"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2 } from "lucide-react"

interface University {
  id: string
  nameEn: string
  country: string
  city: string
  logo?: string
  qsRanking?: number
  totalCost?: number
}

export default function AdminUniversitiesPage() {
  const [universities, setUniversities] = useState<University[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchUniversities()
  }, [])

  const fetchUniversities = async () => {
    try {
      const response = await fetch('/api/universities?limit=100')
      const data = await response.json()
      setUniversities(data.universities || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this university?')) return

    try {
      await fetch(`/api/universities/${id}`, { method: 'DELETE' })
      setUniversities(unis => unis.filter(u => u.id !== id))
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to delete university')
    }
  }

  const filteredUniversities = universities.filter(u =>
    u.nameEn.toLowerCase().includes(search.toLowerCase()) ||
    u.country.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Universities</h1>
          <p className="text-muted-foreground">
            {universities.length} universities in database
          </p>
        </div>
        <Link href="/admin/universities/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add University
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search universities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Universities Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="text-left p-4 font-medium">University</th>
                    <th className="text-left p-4 font-medium">Location</th>
                    <th className="text-left p-4 font-medium">QS Ranking</th>
                    <th className="text-left p-4 font-medium">Cost</th>
                    <th className="text-right p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUniversities.map((uni) => (
                    <tr key={uni.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {uni.logo && (
                            <div className="relative w-10 h-10 flex-shrink-0">
                              <Image
                                src={uni.logo}
                                alt={uni.nameEn}
                                fill
                                className="object-contain"
                              />
                            </div>
                          )}
                          <div>
                            <p className="font-medium">{uni.nameEn}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-sm">{uni.city}, {uni.country}</p>
                      </td>
                      <td className="p-4">
                        {uni.qsRanking ? (
                          <Badge>#{uni.qsRanking}</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="p-4">
                        {uni.totalCost ? (
                          <span className="text-sm">${uni.totalCost.toLocaleString()}</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/universities/${uni.id}/edit`}>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(uni.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUniversities.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No universities found
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

