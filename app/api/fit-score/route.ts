import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { calculateFitScore } from '@/lib/fit-score'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { universityId } = body

    // In production, get userId from session
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get student profile
    const profile = await prisma.studentProfile.findUnique({
      where: { userId }
    })

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found. Please complete your profile first.' },
        { status: 404 }
      )
    }

    // Get university
    const university = await prisma.university.findUnique({
      where: { id: universityId }
    })

    if (!university) {
      return NextResponse.json(
        { error: 'University not found' },
        { status: 404 }
      )
    }

    // Calculate fit score
    const fitScoreResult = calculateFitScore(profile, university)

    // Save to database
    const fitScore = await prisma.fitScore.upsert({
      where: {
        userId_universityId: {
          userId,
          universityId
        }
      },
      update: {
        score: fitScoreResult.score,
        breakdown: fitScoreResult.breakdown,
        explanation: fitScoreResult.explanation,
        category: fitScoreResult.category,
        updatedAt: new Date()
      },
      create: {
        userId,
        universityId,
        score: fitScoreResult.score,
        breakdown: fitScoreResult.breakdown,
        explanation: fitScoreResult.explanation,
        category: fitScoreResult.category
      }
    })

    return NextResponse.json(fitScore)
  } catch (error) {
    console.error('Error calculating fit score:', error)
    return NextResponse.json(
      { error: 'Failed to calculate fit score' },
      { status: 500 }
    )
  }
}

