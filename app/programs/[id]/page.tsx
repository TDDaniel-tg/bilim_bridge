"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Calendar,
    DollarSign,
    MapPin,
    Users,
    GraduationCap,
    Award,
    Globe,
    ExternalLink,
    Clock
} from "lucide-react"
import { formatCurrency, formatDate, calculateDaysUntil } from "@/lib/utils"
import { useLanguage } from "@/lib/contexts/language-context"

interface Program {
    id: string
    name: string
    organizer: string
    type: string
    description: string
    country: string
    city: string
    format: string
    startDate?: string
    endDate?: string
    deadline: string
    ageMin?: number
    ageMax?: number
    requirements?: any
    cost?: number
    scholarships?: any
    curriculum?: string
    instructors?: any
    previousProjects?: any
    prizes?: any
    certificate: boolean
    website?: string
    applicationLink?: string
}

export default function ProgramDetailsPage() {
    const params = useParams()
    const [program, setProgram] = useState<Program | null>(null)
    const [loading, setLoading] = useState(true)
    const { t } = useLanguage()

    useEffect(() => {
        if (params.id) {
            fetchProgram(params.id as string)
        }
    }, [params.id])

    const fetchProgram = async (id: string) => {
        try {
            const response = await fetch(`/api/programs/${id}`)
            if (response.ok) {
                const data = await response.json()
                setProgram(data)
            }
        } catch (error) {
            console.error('Error fetching program:', error)
        } finally {
            setLoading(false)
        }
    }

    const getTypeColor = (type: string) => {
        switch (type) {
            case "SUMMER_SCHOOL": return "bg-blue-100 text-blue-800"
            case "HACKATHON": return "bg-purple-100 text-purple-800"
            case "RESEARCH": return "bg-green-100 text-green-800"
            case "INTERNSHIP": return "bg-orange-100 text-orange-800"
            default: return "bg-gray-100 text-gray-800"
        }
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">{t.programs.loading}</p>
            </div>
        )
    }

    if (!program) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">{t.programs.notFound || "Program Not Found"}</h2>
                <p className="text-muted-foreground mb-6">{t.programs.notFoundDesc || "The program you're looking for doesn't exist."}</p>
                <Link href="/programs">
                    <Button>{t.programs.backToList || "Back to Programs"}</Button>
                </Link>
            </div>
        )
    }

    const daysUntilDeadline = calculateDaysUntil(program.deadline)
    const isDeadlineSoon = daysUntilDeadline > 0 && daysUntilDeadline <= 14

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 py-12">
                <div className="container mx-auto px-4">
                    <Link href="/programs" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
                        ← {t.programs.backToList || "Back to Programs"}
                    </Link>

                    <div className="flex flex-wrap gap-3 mb-4">
                        <Badge className={getTypeColor(program.type)}>
                            {program.type.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline">{program.format}</Badge>
                        {program.certificate && (
                            <Badge className="bg-green-100 text-green-800">
                                <Award className="h-3 w-3 mr-1" />
                                Certificate Provided
                            </Badge>
                        )}
                        {isDeadlineSoon && (
                            <Badge variant="destructive" className="animate-pulse">
                                {t.programs.deadlineSoon}
                            </Badge>
                        )}
                    </div>

                    <h1 className="text-4xl font-bold mb-2">{program.name}</h1>
                    <p className="text-xl text-muted-foreground">
                        {t.programs.by} {program.organizer}
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Description */}
                        <Card>
                            <CardHeader>
                                <CardTitle>About This Program</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground whitespace-pre-wrap">{program.description}</p>
                            </CardContent>
                        </Card>

                        {/* Curriculum */}
                        {program.curriculum && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <GraduationCap className="h-5 w-5" />
                                        Curriculum
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground whitespace-pre-wrap">{program.curriculum}</p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Requirements */}
                        {(program.ageMin || program.ageMax || program.requirements) && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Requirements</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {(program.ageMin || program.ageMax) && (
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                            <span>Age: {program.ageMin || 'Any'} - {program.ageMax || 'Any'} years</span>
                                        </div>
                                    )}
                                    {program.requirements && typeof program.requirements === 'object' && (
                                        <div className="mt-2 space-y-1">
                                            {Object.entries(program.requirements).map(([key, value]) => (
                                                <div key={key} className="text-sm">
                                                    <strong className="capitalize">{key}:</strong> {String(value)}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Prizes (for hackathons) */}
                        {program.prizes && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Award className="h-5 w-5" />
                                        Prizes
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {Array.isArray(program.prizes) ? (
                                        <ul className="list-disc list-inside space-y-1">
                                            {program.prizes.map((prize: any, idx: number) => (
                                                <li key={idx}>{typeof prize === 'string' ? prize : JSON.stringify(prize)}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>{JSON.stringify(program.prizes)}</p>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Key Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Key Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Location */}
                                <div className="flex items-start gap-3">
                                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="font-medium">Location</p>
                                        <p className="text-sm text-muted-foreground">{program.city}, {program.country}</p>
                                    </div>
                                </div>

                                {/* Program Dates */}
                                {program.startDate && program.endDate && (
                                    <div className="flex items-start gap-3">
                                        <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="font-medium">Program Duration</p>
                                            <p className="text-sm text-muted-foreground">
                                                {formatDate(program.startDate)} - {formatDate(program.endDate)}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Deadline */}
                                <div className="flex items-start gap-3">
                                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="font-medium">Application Deadline</p>
                                        <p className={`text-sm ${isDeadlineSoon ? 'text-red-600 font-semibold' : 'text-muted-foreground'}`}>
                                            {formatDate(program.deadline)}
                                            {daysUntilDeadline > 0 && ` (${daysUntilDeadline} days left)`}
                                        </p>
                                    </div>
                                </div>

                                {/* Cost */}
                                <div className="flex items-start gap-3">
                                    <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="font-medium">Cost</p>
                                        <p className="text-sm text-muted-foreground">
                                            {program.cost === 0 ? (
                                                <Badge className="bg-green-600">Free</Badge>
                                            ) : program.cost ? (
                                                formatCurrency(program.cost)
                                            ) : (
                                                'Contact organizer'
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {/* Website */}
                                {program.website && (
                                    <div className="flex items-start gap-3">
                                        <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div className="flex-1">
                                            <p className="font-medium">Website</p>
                                            <a
                                                href={program.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-primary hover:underline flex items-center gap-1"
                                            >
                                                Visit Website <ExternalLink className="h-3 w-3" />
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Scholarships */}
                        {program.scholarships && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Financial Aid</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {Array.isArray(program.scholarships) ? (
                                        <ul className="space-y-2">
                                            {program.scholarships.map((scholarship: any, idx: number) => (
                                                <li key={idx} className="text-sm">
                                                    <p className="font-medium">{scholarship.name}</p>
                                                    <p className="text-muted-foreground">{scholarship.amount}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">{JSON.stringify(program.scholarships)}</p>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Apply Button */}
                        <div className="sticky top-4">
                            {program.applicationLink ? (
                                <a href={program.applicationLink} target="_blank" rel="noopener noreferrer" className="block">
                                    <Button className="w-full" size="lg">
                                        Apply Now <ExternalLink className="ml-2 h-4 w-4" />
                                    </Button>
                                </a>
                            ) : program.website ? (
                                <a href={program.website} target="_blank" rel="noopener noreferrer" className="block">
                                    <Button className="w-full" size="lg">
                                        Learn More <ExternalLink className="ml-2 h-4 w-4" />
                                    </Button>
                                </a>
                            ) : (
                                <Button className="w-full" size="lg" disabled>
                                    Contact Organizer
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
