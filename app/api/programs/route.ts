import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type')
    const country = searchParams.get('country')
    const format = searchParams.get('format')

    const where: any = {}

    if (type) {
      where.type = type
    }

    if (country) {
      where.country = country
    }

    if (format) {
      where.format = format
    }

    const programs = await prisma.program.findMany({
      where,
      orderBy: { deadline: 'asc' },
    })

    return NextResponse.json(programs)
  } catch (error) {
    console.error('Error fetching programs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch programs' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Basic validation could go here

    // Ensure dates are properly cast to Date objects
    if (body.startDate) body.startDate = new Date(body.startDate)
    if (body.endDate) body.endDate = new Date(body.endDate)
    if (body.deadline) body.deadline = new Date(body.deadline)

    const program = await prisma.program.create({
      data: body
    })

    return NextResponse.json(program, { status: 201 })
  } catch (error) {
    console.error('Error creating program:', error)
    return NextResponse.json(
      { error: 'Failed to create program' },
      { status: 500 }
    )
  }
}

