import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
    try {
        const guide = await prisma.guide.findUnique({
            where: {
                slug: params.slug
            }
        })

        if (!guide) {
            return NextResponse.json(
                { error: 'Guide not found' },
                { status: 404 }
            )
        }

        // Increment views asynchronously (fire and forget)
        // In a real app, treat this carefully (debouncing, IP check, etc.)
        // For now, simple increment
        prisma.guide.update({
            where: { id: guide.id },
            data: { views: { increment: 1 } }
        }).catch(console.error)

        return NextResponse.json(guide)
    } catch (error) {
        console.error('Error fetching guide:', error)
        return NextResponse.json(
            { error: 'Failed to fetch guide' },
            { status: 500 }
        )
    }
}
