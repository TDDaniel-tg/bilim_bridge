import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const q = searchParams.get('q')

    if (!q || q.length < 2) {
      return NextResponse.json([])
    }

    const universities = await prisma.university.findMany({
      where: {
        OR: [
          { nameEn: { contains: q, mode: 'insensitive' } },
          { nameRu: { contains: q, mode: 'insensitive' } },
          { city: { contains: q, mode: 'insensitive' } },
          { country: { contains: q, mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        nameEn: true,
        nameRu: true,
        city: true,
        country: true,
        logo: true,
        qsRanking: true
      },
      take: 10
    })

    return NextResponse.json(universities)
  } catch (error) {
    console.error('Error searching universities:', error)
    return NextResponse.json(
      { error: 'Failed to search universities' },
      { status: 500 }
    )
  }
}

