import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const universityId = searchParams.get('universityId')
    const originCountry = searchParams.get('originCountry')
    const major = searchParams.get('major')

    const where: any = {
      isPublished: true
    }

    if (universityId) {
      where.universityId = universityId
    }

    if (originCountry) {
      where.originCountry = originCountry
    }

    if (major) {
      where.major = { contains: major, mode: 'insensitive' }
    }

    const stories = await prisma.successStory.findMany({
      where,
      include: {
        university: {
          select: {
            nameEn: true,
            logo: true,
            country: true,
          }
        }
      },
      orderBy: { admissionYear: 'desc' }
    })

    return NextResponse.json(stories)
  } catch (error) {
    console.error('Error fetching success stories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch success stories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Admin only endpoint
    const body = await request.json()

    const story = await prisma.successStory.create({
      data: {
        ...body,
        isPublished: false // Requires moderation
      }
    })

    return NextResponse.json(story, { status: 201 })
  } catch (error) {
    console.error('Error creating success story:', error)
    return NextResponse.json(
      { error: 'Failed to create success story' },
      { status: 500 }
    )
  }
}

