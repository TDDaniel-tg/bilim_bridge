/**
 * Enhanced University Editor with comprehensive fields
 * for rankings, scholarships, and campus information
 */
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, Loader2, Plus, X } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { US_STATE_OPTIONS } from "@/lib/constants/us-states"

interface UniversityEditorProps {
    params: { id: string }
}

// Custom ranking type
interface CustomRanking {
    name: string
    position: string
    year: string
}

// Full-ride program type
interface FullRideProgram {
    name: string
    criteria: string
    deadline: string
}

// Essay prompt type
interface EssayPrompt {
    prompt: string
    wordLimit: string
    isRequired: boolean
}

export default function UniversityEditorPage({ params }: UniversityEditorProps) {
    const router = useRouter()
    const { t } = useLanguage()
    const [loading, setLoading] = useState(false)
    const [initialLoading, setInitialLoading] = useState(params.id !== 'new')

    const [formData, setFormData] = useState({
        // Basic Information
        nameEn: '',
        nameRu: '',
        motto: '',
        yearEstablished: '',
        country: '',
        city: '',
        usState: '',
        website: '',
        logo: '',
        mapEmbedUrl: '',

        // Rankings
        qsRanking: '',
        qsYear: '',
        usNewsRanking: '',
        usNewsYear: '',
        theRanking: '',
        theYear: '',
        arwuRanking: '',
        arwuYear: '',

        // Financial
        totalCost: '',
        tuitionIntl: '',
        acceptanceRate: '',

        // Degrees
        hasBachelor: false,
        hasMaster: false,
        hasPhd: false,

        // Scholarships
        hasMeritScholarships: false,
        meritDescription: '',
        meritCriteria: '',
        meritAvgAmount: '',
        meritMaxAmount: '',

        hasNeedBased: false,
        needBasedDescription: '',
        needBasedIntl: false,
        needBasedAvgAmount: '',

        hasFullRide: false,
        fullRideDescription: '',

        // Admissions
        requiresCssProfile: false,
        acceptsCommonApp: false,
        hasSupplementalEssays: false,
    })

    // Additional complex data structures
    const [customRankings, setCustomRankings] = useState<CustomRanking[]>([])
    const [fullRidePrograms, setFullRidePrograms] = useState<FullRideProgram[]>([])
    const [essayPrompts, setEssayPrompts] = useState<EssayPrompt[]>([])

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

                // Parse JSON fields
                const customRankingsData = data.customRankings || []
                const fullRideProgramsData = data.fullRidePrograms || []
                const essayPromptsData = data.essayPrompts || []

                setCustomRankings(customRankingsData)
                setFullRidePrograms(fullRideProgramsData)
                setEssayPrompts(essayPromptsData)

                setFormData({
                    ...data,
                    nameRu: data.nameRu || '',
                    motto: data.motto || '',
                    yearEstablished: data.yearEstablished || '',
                    usState: data.usState || '',
                    logo: data.logo || '',
                    mapEmbedUrl: data.mapEmbedUrl || '',
                    qsRanking: data.qsRanking || '',
                    qsYear: data.qsYear || '',
                    usNewsRanking: data.usNewsRanking || '',
                    usNewsYear: data.usNewsYear || '',
                    theRanking: data.theRanking || '',
                    theYear: data.theYear || '',
                    arwuRanking: data.arwuRanking || '',
                    arwuYear: data.arwuYear || '',
                    totalCost: data.totalCost || '',
                    acceptanceRate: data.acceptanceRate || '',
                    tuitionIntl: data.tuitionIntl || '',
                    meritDescription: data.meritDescription || '',
                    meritCriteria: data.meritCriteria || '',
                    meritAvgAmount: data.meritAvgAmount || '',
                    meritMaxAmount: data.meritMaxAmount || '',
                    needBasedDescription: data.needBasedDescription || '',
                    needBasedAvgAmount: data.needBasedAvgAmount || '',
                    fullRideDescription: data.fullRideDescription || '',
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
            [name]: type === 'number' ? (value ? parseFloat(value) : '') : value
        }))
    }

    const handleCheckboxChange = (name: string, checked: boolean) => {
        setFormData(prev => ({ ...prev, [name]: checked }))
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    // Custom rankings handlers
    const addCustomRanking = () => {
        setCustomRankings([...customRankings, { name: '', position: '', year: '' }])
    }

    const updateCustomRanking = (index: number, field: keyof CustomRanking, value: string) => {
        const updated = [...customRankings]
        updated[index][field] = value
        setCustomRankings(updated)
    }

    const removeCustomRanking = (index: number) => {
        setCustomRankings(customRankings.filter((_, i) => i !== index))
    }

    // Full-ride program handlers
    const addFullRideProgram = () => {
        setFullRidePrograms([...fullRidePrograms, { name: '', criteria: '', deadline: '' }])
    }

    const updateFullRideProgram = (index: number, field: keyof FullRideProgram, value: string) => {
        const updated = [...fullRidePrograms]
        updated[index][field] = value
        setFullRidePrograms(updated)
    }

    const removeFullRideProgram = (index: number) => {
        setFullRidePrograms(fullRidePrograms.filter((_, i) => i !== index))
    }

    // Essay prompt handlers
    const addEssayPrompt = () => {
        setEssayPrompts([...essayPrompts, { prompt: '', wordLimit: '', isRequired: false }])
    }

    const updateEssayPrompt = (index: number, field: string, value: string | boolean) => {
        const updated = [...essayPrompts]
        updated[index] = { ...updated[index], [field]: value }
        setEssayPrompts(updated)
    }

    const removeEssayPrompt = (index: number) => {
        setEssayPrompts(essayPrompts.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const url = params.id === 'new' ? '/api/universities' : `/api/universities/${params.id}`
            const method = params.id === 'new' ? 'POST' : 'PATCH'

            // Clean up and prepare payload
            const payload = {
                ...formData,
                yearEstablished: formData.yearEstablished ? parseInt(String(formData.yearEstablished)) : null,
                qsRanking: formData.qsRanking ? parseInt(String(formData.qsRanking)) : null,
                qsYear: formData.qsYear ? parseInt(String(formData.qsYear)) : null,
                usNewsRanking: formData.usNewsRanking ? parseInt(String(formData.usNewsRanking)) : null,
                usNewsYear: formData.usNewsYear ? parseInt(String(formData.usNewsYear)) : null,
                theRanking: formData.theRanking ? parseInt(String(formData.theRanking)) : null,
                theYear: formData.theYear ? parseInt(String(formData.theYear)) : null,
                arwuRanking: formData.arwuRanking ? parseInt(String(formData.arwuRanking)) : null,
                arwuYear: formData.arwuYear ? parseInt(String(formData.arwuYear)) : null,
                totalCost: formData.totalCost ? parseInt(String(formData.totalCost)) : null,
                tuitionIntl: formData.tuitionIntl ? parseInt(String(formData.tuitionIntl)) : null,
                acceptanceRate: formData.acceptanceRate ? parseFloat(String(formData.acceptanceRate)) : null,
                meritAvgAmount: formData.meritAvgAmount ? parseInt(String(formData.meritAvgAmount)) : null,
                meritMaxAmount: formData.meritMaxAmount ? parseInt(String(formData.meritMaxAmount)) : null,
                needBasedAvgAmount: formData.needBasedAvgAmount ? parseInt(String(formData.needBasedAvgAmount)) : null,
                usState: formData.usState || null,
                customRankings: customRankings.length > 0 ? customRankings : null,
                fullRidePrograms: fullRidePrograms.length > 0 ? fullRidePrograms : null,
                essayPrompts: essayPrompts.length > 0 ? essayPrompts : null,
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
        <div className="p-8 max-w-5xl mx-auto">
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
                {/* Basic Information */}
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

                        <div className="grid grid-cols-3 gap-4">
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
                            <div className="space-y-2">
                                <Label htmlFor="usState">US State (if applicable)</Label>
                                <Select
                                    value={formData.usState}
                                    onValueChange={(value) => handleSelectChange('usState', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select state" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">Not in US</SelectItem>
                                        {US_STATE_OPTIONS.map((state) => (
                                            <SelectItem key={state.value} value={state.value}>
                                                {state.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="yearEstablished">Year Established</Label>
                                <Input
                                    id="yearEstablished"
                                    name="yearEstablished"
                                    type="number"
                                    min="1000"
                                    max="2100"
                                    value={formData.yearEstablished}
                                    onChange={handleChange}
                                    placeholder="e.g., 1636"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="mapEmbedUrl">Google Maps Embed URL</Label>
                                <Input
                                    id="mapEmbedUrl"
                                    name="mapEmbedUrl"
                                    value={formData.mapEmbedUrl}
                                    onChange={handleChange}
                                    placeholder="https://maps.google.com/..."
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

                {/* Rankings Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Rankings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
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
                                <Label htmlFor="qsYear">QS Year</Label>
                                <Input
                                    id="qsYear"
                                    name="qsYear"
                                    type="number"
                                    value={formData.qsYear}
                                    onChange={handleChange}
                                    placeholder="2024"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="usNewsRanking">US News Ranking</Label>
                                <Input
                                    id="usNewsRanking"
                                    name="usNewsRanking"
                                    type="number"
                                    value={formData.usNewsRanking}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="usNewsYear">US News Year</Label>
                                <Input
                                    id="usNewsYear"
                                    name="usNewsYear"
                                    type="number"
                                    value={formData.usNewsYear}
                                    onChange={handleChange}
                                    placeholder="2024"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="theRanking">THE Ranking</Label>
                                <Input
                                    id="theRanking"
                                    name="theRanking"
                                    type="number"
                                    value={formData.theRanking}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="theYear">THE Year</Label>
                                <Input
                                    id="theYear"
                                    name="theYear"
                                    type="number"
                                    value={formData.theYear}
                                    onChange={handleChange}
                                    placeholder="2024"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="arwuRanking">ARWU Ranking</Label>
                                <Input
                                    id="arwuRanking"
                                    name="arwuRanking"
                                    type="number"
                                    value={formData.arwuRanking}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="arwuYear">ARWU Year</Label>
                                <Input
                                    id="arwuYear"
                                    name="arwuYear"
                                    type="number"
                                    value={formData.arwuYear}
                                    onChange={handleChange}
                                    placeholder="2024"
                                />
                            </div>
                        </div>

                        {/* Custom Rankings */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label>Custom Rankings</Label>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={addCustomRanking}
                                >
                                    <Plus className="h-4 w-4 mr-1" /> Add Custom Ranking
                                </Button>
                            </div>
                            {customRankings.map((ranking, index) => (
                                <div key={index} className="grid grid-cols-[2fr_1fr_1fr_auto] gap-2 items-end border p-3 rounded">
                                    <Input
                                        placeholder="Ranking name"
                                        value={ranking.name}
                                        onChange={(e) => updateCustomRanking(index, 'name', e.target.value)}
                                    />
                                    <Input
                                        type="number"
                                        placeholder="Position"
                                        value={ranking.position}
                                        onChange={(e) => updateCustomRanking(index, 'position', e.target.value)}
                                    />
                                    <Input
                                        type="number"
                                        placeholder="Year"
                                        value={ranking.year}
                                        onChange={(e) => updateCustomRanking(index, 'year', e.target.value)}
                                    />
                                    <Button
                                        type="button"
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => removeCustomRanking(index)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Academic & Financial Stats */}
                <Card>
                    <CardHeader>
                        <CardTitle>Academic & Financial Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                                <Label htmlFor="tuitionIntl">Tuition ($)</Label>
                                <Input
                                    id="tuitionIntl"
                                    name="tuitionIntl"
                                    type="number"
                                    value={formData.tuitionIntl}
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
                        </div>
                    </CardContent>
                </Card>

                {/* Scholarships & Financial Aid */}
                <Card>
                    <CardHeader>
                        <CardTitle>Scholarships & Financial Aid</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Merit-based Scholarships */}
                        <div className="space-y-4 border-b pb-6">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="hasMeritScholarships"
                                    checked={formData.hasMeritScholarships}
                                    onChange={(e) => handleCheckboxChange('hasMeritScholarships', e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                                <Label htmlFor="hasMeritScholarships" className="font-semibold">Merit-based Scholarships Available</Label>
                            </div>

                            {formData.hasMeritScholarships && (
                                <div className="space-y-4 ml-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="meritDescription">Description</Label>
                                        <Textarea
                                            id="meritDescription"
                                            name="meritDescription"
                                            value={formData.meritDescription}
                                            onChange={handleChange}
                                            rows={3}
                                            placeholder="Describe merit-based scholarship opportunities..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="meritCriteria">Eligibility Criteria</Label>
                                        <Textarea
                                            id="meritCriteria"
                                            name="meritCriteria"
                                            value={formData.meritCriteria}
                                            onChange={handleChange}
                                            rows={3}
                                            placeholder="Academic excellence, test scores, extracurriculars..."
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="meritAvgAmount">Average Amount ($)</Label>
                                            <Input
                                                id="meritAvgAmount"
                                                name="meritAvgAmount"
                                                type="number"
                                                value={formData.meritAvgAmount}
                                                onChange={handleChange}
                                                placeholder="e.g., 25000"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="meritMaxAmount">Maximum Amount ($)</Label>
                                            <Input
                                                id="meritMaxAmount"
                                                name="meritMaxAmount"
                                                type="number"
                                                value={formData.meritMaxAmount}
                                                onChange={handleChange}
                                                placeholder="e.g., 60000"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Need-based Aid */}
                        <div className="space-y-4 border-b pb-6">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="hasNeedBased"
                                    checked={formData.hasNeedBased}
                                    onChange={(e) => handleCheckboxChange('hasNeedBased', e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                                <Label htmlFor="hasNeedBased" className="font-semibold">Need-based Financial Aid Available</Label>
                            </div>

                            {formData.hasNeedBased && (
                                <div className="space-y-4 ml-6">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="needBasedIntl"
                                            checked={formData.needBasedIntl}
                                            onChange={(e) => handleCheckboxChange('needBasedIntl', e.target.checked)}
                                            className="h-4 w-4 rounded border-gray-300"
                                        />
                                        <Label htmlFor="needBasedIntl">Available for International Students</Label>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="needBasedDescription">Description</Label>
                                        <Textarea
                                            id="needBasedDescription"
                                            name="needBasedDescription"
                                            value={formData.needBasedDescription}
                                            onChange={handleChange}
                                            rows={3}
                                            placeholder="Describe need-based aid opportunities..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="needBasedAvgAmount">Average Aid Amount ($)</Label>
                                        <Input
                                            id="needBasedAvgAmount"
                                            name="needBasedAvgAmount"
                                            type="number"
                                            value={formData.needBasedAvgAmount}
                                            onChange={handleChange}
                                            placeholder="e.g., 35000"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Full-ride Scholarships */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="hasFullRide"
                                    checked={formData.hasFullRide}
                                    onChange={(e) => handleCheckboxChange('hasFullRide', e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                                <Label htmlFor="hasFullRide" className="font-semibold">Full-ride Scholarships Available</Label>
                            </div>

                            {formData.hasFullRide && (
                                <div className="space-y-4 ml-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="fullRideDescription">Description</Label>
                                        <Textarea
                                            id="fullRideDescription"
                                            name="fullRideDescription"
                                            value={formData.fullRideDescription}
                                            onChange={handleChange}
                                            rows={2}
                                            placeholder="General description of full-ride opportunities..."
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <Label>Specific Programs</Label>
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="outline"
                                                onClick={addFullRideProgram}
                                            >
                                                <Plus className="h-4 w-4 mr-1" /> Add Program
                                            </Button>
                                        </div>
                                        {fullRidePrograms.map((program, index) => (
                                            <div key={index} className="grid grid-cols-[2fr_2fr_1fr_auto] gap-2 items-end border p-3 rounded">
                                                <Input
                                                    placeholder="Program name"
                                                    value={program.name}
                                                    onChange={(e) => updateFullRideProgram(index, 'name', e.target.value)}
                                                />
                                                <Input
                                                    placeholder="Selection criteria"
                                                    value={program.criteria}
                                                    onChange={(e) => updateFullRideProgram(index, 'criteria', e.target.value)}
                                                />
                                                <Input
                                                    type="date"
                                                    placeholder="Deadline"
                                                    value={program.deadline}
                                                    onChange={(e) => updateFullRideProgram(index, 'deadline', e.target.value)}
                                                />
                                                <Button
                                                    type="button"
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => removeFullRideProgram(index)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Admissions & Essays */}
                <Card>
                    <CardHeader>
                        <CardTitle>Admissions & Essays</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="acceptsCommonApp"
                                    checked={formData.acceptsCommonApp}
                                    onChange={(e) => handleCheckboxChange('acceptsCommonApp', e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                                <Label htmlFor="acceptsCommonApp">Accepts Common App</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="requiresCssProfile"
                                    checked={formData.requiresCssProfile}
                                    onChange={(e) => handleCheckboxChange('requiresCssProfile', e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                                <Label htmlFor="requiresCssProfile">Requires CSS Profile</Label>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="hasSupplementalEssays"
                                    checked={formData.hasSupplementalEssays}
                                    onChange={(e) => handleCheckboxChange('hasSupplementalEssays', e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                                <Label htmlFor="hasSupplementalEssays" className="font-semibold">Has Supplemental Essays</Label>
                            </div>

                            {formData.hasSupplementalEssays && (
                                <div className="space-y-3 ml-6">
                                    <div className="flex items-center justify-between">
                                        <Label>Essay Prompts</Label>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="outline"
                                            onClick={addEssayPrompt}
                                        >
                                            <Plus className="h-4 w-4 mr-1" /> Add Essay Prompt
                                        </Button>
                                    </div>
                                    {essayPrompts.map((prompt, index) => (
                                        <div key={index} className="border p-4 rounded space-y-3">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1 space-y-2">
                                                    <Textarea
                                                        placeholder="Essay prompt text"
                                                        value={prompt.prompt}
                                                        onChange={(e) => updateEssayPrompt(index, 'prompt', e.target.value)}
                                                        rows={2}
                                                    />
                                                </div>
                                                <Button
                                                    type="button"
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => removeEssayPrompt(index)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <Input
                                                    type="number"
                                                    placeholder="Word limit"
                                                    value={prompt.wordLimit}
                                                    onChange={(e) => updateEssayPrompt(index, 'wordLimit', e.target.value)}
                                                />
                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        id={`essayRequired${index}`}
                                                        checked={prompt.isRequired}
                                                        onChange={(e) => updateEssayPrompt(index, 'isRequired', e.target.checked)}
                                                        className="h-4 w-4 rounded border-gray-300"
                                                    />
                                                    <Label htmlFor={`essayRequired${index}`}>Required</Label>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Degrees Offered */}
                <Card>
                    <CardHeader>
                        <CardTitle>Degrees Offered</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
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
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4 sticky bottom-0 bg-background py-4 border-t">
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
