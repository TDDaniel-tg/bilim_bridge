"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/lib/contexts/language-context"
import { Card, CardContent } from "@/components/ui/card"
import { Award, Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { formatDate } from "@/lib/utils"

export default function AdminProgramsPage() {
    const { t } = useLanguage()
    const [programs, setPrograms] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchPrograms()
    }, [])

    const fetchPrograms = async () => {
        try {
            const res = await fetch('/api/programs')
            const data = await res.json()
            setPrograms(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return
        try {
            await fetch(`/api/programs/${id}`, { method: 'DELETE' })
            setPrograms(programs.filter(p => p.id !== id))
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="p-8">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold mb-2">{t.admin.nav.programs}</h1>
                    <p className="text-muted-foreground">
                        {t.admin.dashboard.subtitle}
                    </p>
                </div>
                <Link href="/admin/programs/new">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Program
                    </Button>
                </Link>
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : programs.length === 0 ? (
                <Card className="text-center py-12">
                    <CardContent>
                        <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Programs Yet</h3>
                        <p className="text-muted-foreground">
                            Programs management coming soon
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardContent className="p-0">
                        <table className="w-full">
                            <thead className="border-b">
                                <tr>
                                    <th className="text-left p-4">Name</th>
                                    <th className="text-left p-4">Organizer</th>
                                    <th className="text-left p-4">Type</th>
                                    <th className="text-left p-4">Deadline</th>
                                    <th className="text-right p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {programs.map((program) => (
                                    <tr key={program.id} className="border-b hover:bg-muted/50">
                                        <td className="p-4 font-medium">{program.name}</td>
                                        <td className="p-4">{program.organizer}</td>
                                        <td className="p-4">{program.type}</td>
                                        <td className="p-4">{formatDate(program.deadline)}</td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/admin/programs/${program.id}/edit`}>
                                                    <Button variant="ghost" size="sm">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button variant="ghost" size="sm" onClick={() => handleDelete(program.id)}>
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
