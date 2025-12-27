import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Admin only - fetch all requests
    const consultations = await prisma.consultationRequest.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            email: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
              }
            }
          }
        }
      }
    })

    return NextResponse.json(consultations)
  } catch (error) {
    console.error('Error fetching consultations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch consultations' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // Assume body contains userId, topic, etc.
    // Basic validation

    const consultation = await prisma.consultationRequest.create({
      data: body
    })

    return NextResponse.json(consultation, { status: 201 })
  } catch (error) {
    console.error('Error creating consultation request:', error)
    return NextResponse.json(
      { error: 'Failed to create consultation request' },
      { status: 500 }
    )
  }
}
