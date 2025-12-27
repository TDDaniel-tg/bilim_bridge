import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateChecklistItems, calculateDeadline } from '@/lib/checklist-generator'

export async function GET(request: NextRequest) {
  try {
    // In production, get userId from session
    const userId = request.headers.get('x-user-id')

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const checklists = await prisma.checklist.findMany({
      where: { userId },
      include: {
        university: {
          select: {
            nameEn: true,
            logo: true,
            country: true,
            regularDeadline: true,
            earlyActionDate: true,
            edDeadline: true
          }
        },
        items: {
          orderBy: { order: 'asc' }
        }
      }
    })

    // Calculate progress for each checklist
    const checklistsWithProgress = checklists.map(checklist => {
      const completedItems = checklist.items.filter(item => item.status === 'COMPLETED').length
      const totalItems = checklist.items.length
      const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0

      return {
        ...checklist,
        progress,
        completedItems,
        totalItems
      }
    })

    return NextResponse.json(checklistsWithProgress)
  } catch (error) {
    console.error('Error fetching checklists:', error)
    return NextResponse.json(
      { error: 'Failed to fetch checklists' },
      { status: 500 }
    )
  }
}

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

    // Check if checklist already exists
    const existingChecklist = await prisma.checklist.findUnique({
      where: {
        userId_universityId: {
          userId,
          universityId
        }
      }
    })

    if (existingChecklist) {
      return NextResponse.json(
        { error: 'Checklist already exists for this university' },
        { status: 400 }
      )
    }

    // Get university details
    const university = await prisma.university.findUnique({
      where: { id: universityId }
    })

    if (!university) {
      return NextResponse.json(
        { error: 'University not found' },
        { status: 404 }
      )
    }

    // Generate checklist items based on university requirements
    const itemTemplates = generateChecklistItems(university)

    // Determine base deadline (use regular deadline or early action)
    const baseDeadline = university.regularDeadline || university.earlyActionDate || new Date()

    // Create checklist with items
    const checklist = await prisma.checklist.create({
      data: {
        userId,
        universityId,
        items: {
          create: itemTemplates.map(template => ({
            title: template.title,
            description: template.description,
            category: template.category,
            status: 'PENDING',
            order: template.order,
            deadline: template.deadlineOffset 
              ? calculateDeadline(baseDeadline, template.deadlineOffset)
              : null,
            isCustom: false
          }))
        }
      },
      include: {
        items: true,
        university: {
          select: {
            nameEn: true,
            logo: true,
            regularDeadline: true
          }
        }
      }
    })

    return NextResponse.json(checklist, { status: 201 })
  } catch (error) {
    console.error('Error creating checklist:', error)
    return NextResponse.json(
      { error: 'Failed to create checklist' },
      { status: 500 }
    )
  }
}

