import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const story = await prisma.successStory.findUnique({
            where: { id: params.id },
            include: {
                university: {
                    select: {
                        nameEn: true,
                        logo: true,
                        country: true,
                    }
                }
            }
        })

        if (!story) {
            return NextResponse.json(
                { error: 'Success story not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(story)
    } catch (error) {
        console.error('Error fetching success story:', error)
        return NextResponse.json(
            { error: 'Failed to fetch success story' },
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

        const story = await prisma.successStory.update({
            where: { id: params.id },
            data: body
        })

        return NextResponse.json(story)
    } catch (error) {
        console.error('Error updating success story:', error)
        return NextResponse.json(
            { error: 'Failed to update success story' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.successStory.delete({
            where: { id: params.id }
        })

        return NextResponse.json({ message: 'Success story deleted successfully' })
    } catch (error) {
        console.error('Error deleting success story:', error)
        return NextResponse.json(
            { error: 'Failed to delete success story' },
            { status: 500 }
        )
    }
}
