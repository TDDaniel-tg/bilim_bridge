"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useLanguage } from "@/lib/contexts/language-context"
import { ArrowLeft, Quote, School } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function SuccessStoryDetailPage() {
    const params = useParams()
    const { t } = useLanguage()
    const [story, setStory] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (params.id) {
            fetchStory(params.id as string)
        }
    }, [params.id])

    const fetchStory = async (id: string) => {
        try {
            const res = await fetch(`/api/success-stories/${id}`)
            if (res.ok) {
                const data = await res.json()
                setStory(data)
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

    if (!story) {
        return <div className="container mx-auto px-4 py-8">Story not found</div>
    }

    return (
        <div className="min-h-screen bg-muted/30">
            <div className="container mx-auto px-4 py-8">
                <Button variant="ghost" asChild className="mb-8">
                    <Link href="/success-stories">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Stories
                    </Link>
                </Button>

                <div className="max-w-4xl mx-auto">
                    <div className="bg-card rounded-2xl p-8 md:p-12 shadow-sm border">
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            <Avatar className="w-24 h-24 md:w-32 md:h-32">
                                <AvatarImage src={story.studentPhoto || ''} />
                                <AvatarFallback>{story.studentName.charAt(0)}</AvatarFallback>
                            </Avatar>

                            <div className="flex-1">
                                <h1 className="text-3xl font-bold mb-2">{story.studentName}</h1>
                                <div className="text-xl text-primary font-medium mb-4">{story.university?.nameEn || 'University'}</div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-sm">
                                    <div className="bg-muted/50 p-3 rounded-lg">
                                        <div className="text-muted-foreground mb-1">Major</div>
                                        <div className="font-semibold">{story.major}</div>
                                    </div>
                                    <div className="bg-muted/50 p-3 rounded-lg">
                                        <div className="text-muted-foreground mb-1">Year</div>
                                        <div className="font-semibold">{story.admissionYear}</div>
                                    </div>
                                    {story.satScore && (
                                        <div className="bg-muted/50 p-3 rounded-lg">
                                            <div className="text-muted-foreground mb-1">SAT</div>
                                            <div className="font-semibold">{story.satScore}</div>
                                        </div>
                                    )}
                                    {story.ieltsScore && (
                                        <div className="bg-muted/50 p-3 rounded-lg">
                                            <div className="text-muted-foreground mb-1">IELTS</div>
                                            <div className="font-semibold">{story.ieltsScore}</div>
                                        </div>
                                    )}
                                </div>

                                <div className="relative">
                                    <Quote className="absolute -top-2 -left-2 h-8 w-8 text-muted-foreground/10 fill-current" />
                                    <blockquote className="text-lg md:text-xl leading-relaxed text-muted-foreground pl-6 border-l-4 border-primary/20 italic">
                                        "{story.testimonial}"
                                    </blockquote>
                                </div>

                                {story.finAidReceived && (
                                    <div className="mt-8 pt-8 border-t">
                                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-600 rounded-full font-medium text-sm">
                                            <span className="text-lg">💰</span>
                                            Received Financial Aid: ${story.finAidReceived.toLocaleString()}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
