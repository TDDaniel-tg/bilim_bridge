"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/lib/contexts/language-context"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default function AdminGuidesPage() {
    const { t } = useLanguage()
    const [guides, setGuides] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchGuides()
    }, [])

    const fetchGuides = async () => {
        try {
            const res = await fetch('/api/guides')
            const data = await res.json()
            setGuides(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return
        try {
            await fetch(`/api/guides/${id}`, { method: 'DELETE' })
            setGuides(guides.filter(g => g.id !== id))
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="p-8">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold mb-2">{t.admin.nav.guides}</h1>
                    <p className="text-muted-foreground">
                        {t.admin.dashboard.subtitle}
                    </p>
                </div>
                <Link href="/admin/guides/new">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Guide
                    </Button>
                </Link>
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : guides.length === 0 ? (
                <Card className="text-center py-12">
                    <CardContent>
                        <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Guides Yet</h3>
                        <p className="text-muted-foreground">
                            Guides management coming soon
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardContent className="p-0">
                        <table className="w-full">
                            <thead className="border-b">
                                <tr>
                                    <th className="text-left p-4">Title</th>
                                    <th className="text-left p-4">Category</th>
                                    <th className="text-left p-4">Views</th>
                                    <th className="text-right p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {guides.map((guide) => (
                                    <tr key={guide.id} className="border-b hover:bg-muted/50">
                                        <td className="p-4 font-medium">{guide.title}</td>
                                        <td className="p-4">
                                            <Badge variant="outline">{guide.category}</Badge>
                                        </td>
                                        <td className="p-4">{guide.views}</td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/admin/guides/${guide.id}/edit`}>
                                                    <Button variant="ghost" size="sm">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button variant="ghost" size="sm" onClick={() => handleDelete(guide.id)}>
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
