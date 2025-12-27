"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useLanguage } from "@/lib/contexts/language-context"
import { formatDate } from "@/lib/utils"
import { Calendar, MapPin, Globe, CreditCard, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ProgramDetailPage() {
    const params = useParams()
    const { t } = useLanguage()
    const [program, setProgram] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (params.id) {
            fetchProgram(params.id as string)
        }
    }, [params.id])

    const fetchProgram = async (id: string) => {
        try {
            const res = await fetch(`/api/programs/${id}`)
            if (res.ok) {
                const data = await res.json()
                setProgram(data)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <div className="container mx-auto px-4 py-8">Loading...</div>
    }

    if (!program) {
        return <div className="container mx-auto px-4 py-8">Program not found</div>
    }

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Banner */}
            <div className="bg-primary/10 py-12 md:py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary">
                                {program.type}
                            </span>
                            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground border">
                                {program.format}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold mb-4">{program.name}</h1>
                        <p className="text-xl text-muted-foreground mb-6">{program.organizer}</p>
                        <div className="flex flex-wrap gap-6 text-sm">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                {program.city}, {program.country}
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {formatDate(program.startDate)} - {formatDate(program.endDate)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-8">
                        <div className="bg-card rounded-lg p-6 md:p-8 shadow-sm border">
                            <h2 className="text-2xl font-bold mb-4">About the Program</h2>
                            <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                                {program.description}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-card rounded-lg p-6 shadow-sm border space-y-4">
                            <h3 className="font-semibold text-lg">Key Details</h3>

                            <div className="space-y-3 pt-2">
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <Calendar className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <div className="font-medium">Deadline</div>
                                        <div className="text-muted-foreground">{formatDate(program.deadline)}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <CreditCard className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <div className="font-medium">Cost</div>
                                        <div className="text-muted-foreground">{program.cost ? `$${program.cost}` : 'Free'}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                {program.website && (
                                    <Button className="w-full" asChild>
                                        <a href={program.website} target="_blank" rel="noopener noreferrer">
                                            Visit Website
                                            <ChevronRight className="h-4 w-4 ml-2" />
                                        </a>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
