"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

export default function SuccessStoryEditorPage({ params }: { params: { id?: string } }) {
    const router = useRouter()
    const { t } = useLanguage()
    const isNew = !params?.id || params.id === 'new'
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        studentName: '',
        major: '',
        admissionYear: new Date().getFullYear(),
        originCountry: '',
        gpa: '',
        satScore: '',
        ieltsScore: '',
        finAidReceived: '',
        testimonial: '',
        universityId: '', // Need a way to select university, for now just input ID
        isPublished: false
    })

    useEffect(() => {
        if (!isNew && params.id) {
            fetchStory(params.id)
        }
    }, [params.id])

    const fetchStory = async (id: string) => {
        try {
            const res = await fetch(`/api/success-stories/${id}`)
            const data = await res.json()
            setFormData(data)
        } catch (err) {
            console.error(err)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const url = isNew ? '/api/success-stories' : `/api/success-stories/${params.id}`
            const method = isNew ? 'POST' : 'PATCH'

            // Convert numbers
            const payload = {
                ...formData,
                admissionYear: parseInt(formData.admissionYear.toString()),
                gpa: formData.gpa ? parseFloat(formData.gpa.toString()) : null,
                satScore: formData.satScore ? parseInt(formData.satScore.toString()) : null,
                ieltsScore: formData.ieltsScore ? parseFloat(formData.ieltsScore.toString()) : null,
                finAidReceived: formData.finAidReceived ? parseInt(formData.finAidReceived.toString()) : null,
            }

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            if (res.ok) {
                router.push('/admin/success-stories')
                router.refresh()
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
            </Button>

            <Card>
                <CardHeader>
                    <CardTitle>{isNew ? 'New Success Story' : 'Edit Success Story'}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Student Name</Label>
                                <Input
                                    value={formData.studentName}
                                    onChange={e => setFormData({ ...formData, studentName: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Origin Country</Label>
                                <Input
                                    value={formData.originCountry}
                                    onChange={e => setFormData({ ...formData, originCountry: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>University ID (Temporary)</Label>
                            <Input
                                value={formData.universityId}
                                onChange={e => setFormData({ ...formData, universityId: e.target.value })}
                                required
                                placeholder="Enter University ID (UUID)"
                            />
                            <p className="text-xs text-muted-foreground">In a real app, this would be a search/select component for Universities.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Major</Label>
                                <Input
                                    value={formData.major}
                                    onChange={e => setFormData({ ...formData, major: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Admission Year</Label>
                                <Input
                                    type="number"
                                    value={formData.admissionYear}
                                    onChange={e => setFormData({ ...formData, admissionYear: parseInt(e.target.value) })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <Label>GPA</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={formData.gpa || ''}
                                    onChange={e => setFormData({ ...formData, gpa: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>SAT</Label>
                                <Input
                                    type="number"
                                    value={formData.satScore || ''}
                                    onChange={e => setFormData({ ...formData, satScore: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>IELTS</Label>
                                <Input
                                    type="number"
                                    step="0.5"
                                    value={formData.ieltsScore || ''}
                                    onChange={e => setFormData({ ...formData, ieltsScore: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Fin Aid ($)</Label>
                                <Input
                                    type="number"
                                    value={formData.finAidReceived || ''}
                                    onChange={e => setFormData({ ...formData, finAidReceived: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Testimonial</Label>
                            <Textarea
                                value={formData.testimonial || ''}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, testimonial: e.target.value })}
                                rows={5}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="published"
                                checked={formData.isPublished}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, isPublished: e.target.checked })}
                            />
                            <Label htmlFor="published">Published</Label>
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Story'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
