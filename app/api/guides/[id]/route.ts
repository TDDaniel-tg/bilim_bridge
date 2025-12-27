import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Try to find by ID first, then by Slug if possible? 
        // Usually admin edits by ID. Public reads by Slug.
        // Let's support both or just ID for this endpoint. Admin uses ID.
        // Public page uses filtering by slug in list or specific endpoint? 
        // Public detailed page `/guides/[slug]` likely needs to fetch by slug.
        // But this file `[id]` matches by ID in Next.js structure usually.
        // For now let's assume this is mostly for Admin operations by ID. 
        // If public needs by slug, it might fetch via `GET /api/guides?slug=...` or we handle slug here.

        const guide = await prisma.guide.findUnique({
            where: { id: params.id }
        })

        if (!guide) {
            return NextResponse.json(
                { error: 'Guide not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(guide)
    } catch (error) {
        console.error('Error fetching guide:', error)
        return NextResponse.json(
            { error: 'Failed to fetch guide' },
            { status: 500 }
        )
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json()

        const guide = await prisma.guide.update({
            where: { id: params.id },
            data: body
        })

        return NextResponse.json(guide)
    } catch (error) {
        console.error('Error updating guide:', error)
        return NextResponse.json(
            { error: 'Failed to update guide' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.guide.delete({
            where: { id: params.id }
        })

        return NextResponse.json({ message: 'Guide deleted successfully' })
    } catch (error) {
        console.error('Error deleting guide:', error)
        return NextResponse.json(
            { error: 'Failed to delete guide' },
            { status: 500 }
        )
    }
}
