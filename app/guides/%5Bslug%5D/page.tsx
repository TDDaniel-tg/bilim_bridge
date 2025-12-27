"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useLanguage } from "@/lib/contexts/language-context"
import { formatDate } from "@/lib/utils"
import { ArrowLeft, Calendar, Eye, ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default function GuideDetailPage() {
    const params = useParams()
    const { t } = useLanguage()
    const [guide, setGuide] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (params.slug) {
            fetchGuide(params.slug as string)
        }
    }, [params.slug])

    const fetchGuide = async (slug: string) => {
        try {
            const res = await fetch(`/api/guides/by-slug/${slug}`)
            if (res.ok) {
                const data = await res.json()
                setGuide(data)
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

    if (!guide) {
        return <div className="container mx-auto px-4 py-8">Guide not found</div>
    }

    return (
        <div className="min-h-screen bg-muted/30">
            <div className="container mx-auto px-4 py-8">
                <Button variant="ghost" asChild className="mb-8">
                    <Link href="/guides">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Guides
                    </Link>
                </Button>

                <div className="max-w-4xl mx-auto">
                    <article className="bg-card rounded-2xl p-8 md:p-12 shadow-sm border">
                        <div className="mb-6 flex gap-2">
                            <Badge>{guide.category}</Badge>
                            <div className="flex items-center text-muted-foreground text-sm gap-4 ml-auto">
                                <span className="flex items-center gap-1">
                                    <Eye className="h-4 w-4" />
                                    {guide.views}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {formatDate(guide.createdAt)}
                                </span>
                            </div>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-bold mb-6">{guide.title}</h1>

                        {guide.excerpt && (
                            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                                {guide.excerpt}
                            </p>
                        )}

                        <div className="prose prose-lg dark:prose-invert max-w-none">
                            {/* 
                      In a real app, use a markdown renderer like 'react-markdown' 
                      or 'dangerouslySetInnerHTML' if the content is sanitized HTML. 
                      For now, just displaying as whitespace-pre-wrap text or basic HTML 
                    */}
                            <div className="whitespace-pre-wrap">{guide.content}</div>
                        </div>

                    </article>
                </div>
            </div>
        </div>
    )
}
