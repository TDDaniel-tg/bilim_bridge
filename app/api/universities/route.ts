import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    
    // Extract filter parameters
    const country = searchParams.get('country')
    const major = searchParams.get('major')
    const minGpa = searchParams.get('minGpa')
    const maxGpa = searchParams.get('maxGpa')
    const minSat = searchParams.get('minSat')
    const minIelts = searchParams.get('minIelts')
    const minToefl = searchParams.get('minToefl')
    const hasScholarships = searchParams.get('hasScholarships')
    const qsRankingMax = searchParams.get('qsRankingMax')
    const minCost = searchParams.get('minCost')
    const maxCost = searchParams.get('maxCost')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const sortBy = searchParams.get('sortBy') || 'qsRanking'
    const sortOrder = searchParams.get('sortOrder') || 'asc'

    // Build where clause
    const where: any = {}

    if (country) where.country = country
    
    if (major) {
      where.majors = {
        path: '$[*].name',
        string_contains: major
      }
    }

    if (minGpa) {
      where.minGpa = { lte: parseFloat(minGpa) }
    }

    if (maxGpa) {
      where.avgGpa = { gte: parseFloat(maxGpa) }
    }

    if (minSat) {
      where.minSat = { lte: parseInt(minSat) }
    }

    if (minIelts) {
      where.minIelts = { lte: parseFloat(minIelts) }
    }

    if (minToefl) {
      where.minToefl = { lte: parseInt(minToefl) }
    }

    if (hasScholarships === 'true') {
      where.OR = [
        { hasMeritScholarships: true },
        { hasNeedBased: true },
        { hasFullRide: true }
      ]
    }

    if (qsRankingMax) {
      where.qsRanking = { lte: parseInt(qsRankingMax) }
    }

    if (minCost && maxCost) {
      where.totalCost = {
        gte: parseInt(minCost),
        lte: parseInt(maxCost)
      }
    } else if (maxCost) {
      where.totalCost = { lte: parseInt(maxCost) }
    }

    if (search) {
      where.OR = [
        { nameEn: { contains: search, mode: 'insensitive' } },
        { nameRu: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Get total count
    const total = await prisma.university.count({ where })

    // Get universities with pagination
    const universities = await prisma.university.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: sortBy === 'qsRanking' 
        ? { qsRanking: sortOrder as 'asc' | 'desc' }
        : sortBy === 'totalCost'
        ? { totalCost: sortOrder as 'asc' | 'desc' }
        : sortBy === 'acceptanceRate'
        ? { acceptanceRate: sortOrder as 'asc' | 'desc' }
        : { createdAt: 'desc' }
    })

    return NextResponse.json({
      universities,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching universities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch universities' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // This endpoint is for admin use only
    // In production, add authentication middleware
    const body = await request.json()

    const university = await prisma.university.create({
      data: body
    })

    return NextResponse.json(university, { status: 201 })
  } catch (error) {
    console.error('Error creating university:', error)
    return NextResponse.json(
      { error: 'Failed to create university' },
      { status: 500 }
    )
  }
}

