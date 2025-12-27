import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, description, category, deadline } = body

    const checklistItem = await prisma.checklistItem.create({
      data: {
        checklistId: params.id,
        title,
        description,
        category,
        deadline: deadline ? new Date(deadline) : null,
        status: 'PENDING',
        order: 999, // Put custom items at the end
        isCustom: true
      }
    })

    return NextResponse.json(checklistItem, { status: 201 })
  } catch (error) {
    console.error('Error creating checklist item:', error)
    return NextResponse.json(
      { error: 'Failed to create checklist item' },
      { status: 500 }
    )
  }
}

