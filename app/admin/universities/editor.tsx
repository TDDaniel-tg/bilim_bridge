"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, Loader2, X } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface UniversityEditorProps {
    params: { id: string }
}

export default function UniversityEditorPage({ params }: UniversityEditorProps) {
    const router = useRouter()
    const { t } = useLanguage()
    const [loading, setLoading] = useState(false)
    const [initialLoading, setInitialLoading] = useState(params.id !== 'new')

    const [formData, setFormData] = useState({
        nameEn: '',
        nameRu: '',
        motto: '',
        country: '',
        city: '',
        website: '',
        logo: '',
        qsRanking: '',
        totalCost: '',
        acceptanceRate: '',
        tuitionIntl: '',
        hasBachelor: false,
        hasMaster: false,
        hasPhd: false,
        hasMeritScholarships: false,
        hasNeedBased: false,
        hasFullRide: false,
    })

    useEffect(() => {
        if (params.id !== 'new') {
            fetchUniversity()
        }
    }, [params.id])

    const fetchUniversity = async () => {
        try {
            const res = await fetch(`/api/universities/${params.id}`)
            if (res.ok) {
                const data = await res.json()
                setFormData({
                    ...data,
                    nameRu: data.nameRu || '',
                    motto: data.motto || '',
                    logo: data.logo || '',
                    qsRanking: data.qsRanking || '',
                    totalCost: data.totalCost || '',
                    acceptanceRate: data.acceptanceRate || '',
                    tuitionIntl: data.tuitionIntl || '',
                })
            }
        } catch (error) {
            console.error('Error fetching university:', error)
        } finally {
            setInitialLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? (value ? parseFloat(value) : null) : value
        }))
    }

    const handleCheckboxChange = (name: string, checked: boolean) => {
        setFormData(prev => ({ ...prev, [name]: checked }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const url = params.id === 'new' ? '/api/universities' : `/api/universities/${params.id}`
            const method = params.id === 'new' ? 'POST' : 'PATCH'

            // Clean up number fields
            const payload = {
                ...formData,
                qsRanking: formData.qsRanking ? parseInt(String(formData.qsRanking)) : null,
                totalCost: formData.totalCost ? parseInt(String(formData.totalCost)) : null,
                tuitionIntl: formData.tuitionIntl ? parseInt(String(formData.tuitionIntl)) : null,
                acceptanceRate: formData.acceptanceRate ? parseFloat(String(formData.acceptanceRate)) : null,
            }

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            if (res.ok) {
                router.push('/admin/universities')
                router.refresh()
            } else {
                const error = await res.json()
                alert(error.error || 'Failed to save university')
            }
        } catch (error) {
            console.error('Error saving university:', error)
            alert('An error occurred')
        } finally {
            setLoading(false)
        }
    }

    if (initialLoading) {
        return <div className="p-8">Loading...</div>
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/universities">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold">
                    {params.id === 'new' ? 'New University' : 'Edit University'}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="nameEn">Name (English) *</Label>
                                <Input
                                    id="nameEn"
                                    name="nameEn"
                                    value={formData.nameEn}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="nameRu">Name (Russian)</Label>
                                <Input
                                    id="nameRu"
                                    name="nameRu"
                                    value={formData.nameRu}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="motto">Motto</Label>
                            <Input
                                id="motto"
                                name="motto"
                                value={formData.motto}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="country">Country *</Label>
                                <Input
                                    id="country"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="city">City *</Label>
                                <Input
                                    id="city"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="website">Website URL</Label>
                                <Input
                                    id="website"
                                    name="website"
                                    type="url"
                                    value={formData.website}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="logo">Logo URL</Label>
                                <Input
                                    id="logo"
                                    name="logo"
                                    value={formData.logo}
                                    onChange={handleChange}
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Academic & Financial Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="qsRanking">QS Ranking</Label>
                                <Input
                                    id="qsRanking"
                                    name="qsRanking"
                                    type="number"
                                    value={formData.qsRanking}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="acceptanceRate">Acceptance Rate (0-100)</Label>
                                <Input
                                    id="acceptanceRate"
                                    name="acceptanceRate"
                                    type="number"
                                    step="0.1"
                                    value={formData.acceptanceRate}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="totalCost">Total Cost ($)</Label>
                                <Input
                                    id="totalCost"
                                    name="totalCost"
                                    type="number"
                                    value={formData.totalCost}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="tuitionIntl">Tuition ($)</Label>
                                <Input
                                    id="tuitionIntl"
                                    name="tuitionIntl"
                                    type="number"
                                    value={formData.tuitionIntl}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Offerings & Financial Aid</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h4 className="font-semibold text-sm">Degrees</h4>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="hasBachelor"
                                        checked={formData.hasBachelor}
                                        onChange={(e) => handleCheckboxChange('hasBachelor', e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300"
                                    />
                                    <Label htmlFor="hasBachelor">Bachelor's</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="hasMaster"
                                        checked={formData.hasMaster}
                                        onChange={(e) => handleCheckboxChange('hasMaster', e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300"
                                    />
                                    <Label htmlFor="hasMaster">Master's</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="hasPhd"
                                        checked={formData.hasPhd}
                                        onChange={(e) => handleCheckboxChange('hasPhd', e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300"
                                    />
                                    <Label htmlFor="hasPhd">PhD</Label>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-semibold text-sm">Financial Aid</h4>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="hasMeritScholarships"
                                        checked={formData.hasMeritScholarships}
                                        onChange={(e) => handleCheckboxChange('hasMeritScholarships', e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300"
                                    />
                                    <Label htmlFor="hasMeritScholarships">Merit Scholarships</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="hasNeedBased"
                                        checked={formData.hasNeedBased}
                                        onChange={(e) => handleCheckboxChange('hasNeedBased', e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300"
                                    />
                                    <Label htmlFor="hasNeedBased">Need-Based Aid</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="hasFullRide"
                                        checked={formData.hasFullRide}
                                        onChange={(e) => handleCheckboxChange('hasFullRide', e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300"
                                    />
                                    <Label htmlFor="hasFullRide">Full Ride Available</Label>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                    <Link href="/admin/universities">
                        <Button type="button" variant="outline">Cancel</Button>
                    </Link>
                    <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save University
                    </Button>
                </div>
            </form>
        </div>
    )
}
