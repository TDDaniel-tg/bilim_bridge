import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const program = await prisma.program.findUnique({
            where: { id: params.id }
        })

        if (!program) {
            return NextResponse.json(
                { error: 'Program not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(program)
    } catch (error) {
        console.error('Error fetching program:', error)
        return NextResponse.json(
            { error: 'Failed to fetch program' },
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

        // Handle date conversions if they refer to date fields
        if (body.startDate) body.startDate = new Date(body.startDate)
        if (body.endDate) body.endDate = new Date(body.endDate)
        if (body.deadline) body.deadline = new Date(body.deadline)

        const program = await prisma.program.update({
            where: { id: params.id },
            data: body
        })

        return NextResponse.json(program)
    } catch (error) {
        console.error('Error updating program:', error)
        return NextResponse.json(
            { error: 'Failed to update program' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.program.delete({
            where: { id: params.id }
        })

        return NextResponse.json({ message: 'Program deleted successfully' })
    } catch (error) {
        console.error('Error deleting program:', error)
        return NextResponse.json(
            { error: 'Failed to delete program' },
            { status: 500 }
        )
    }
}
