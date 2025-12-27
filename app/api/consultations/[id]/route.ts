import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    // Typically used for changing status (NEW -> IN_PROGRESS -> COMPLETED)

    const consultation = await prisma.consultationRequest.update({
      where: { id: params.id },
      data: body
    })

    return NextResponse.json(consultation)
  } catch (error) {
    console.error('Error updating consultation:', error)
    return NextResponse.json(
      { error: 'Failed to update consultation' },
      { status: 500 }
    )
  }
}
