import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; itemId: string } }
) {
  try {
    const body = await request.json()
    const { status, deadline, order } = body

    const updateData: any = {}
    if (status) updateData.status = status
    if (deadline !== undefined) updateData.deadline = deadline ? new Date(deadline) : null
    if (order !== undefined) updateData.order = order

    const checklistItem = await prisma.checklistItem.update({
      where: { id: params.itemId },
      data: updateData
    })

    return NextResponse.json(checklistItem)
  } catch (error) {
    console.error('Error updating checklist item:', error)
    return NextResponse.json(
      { error: 'Failed to update checklist item' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; itemId: string } }
) {
  try {
    await prisma.checklistItem.delete({
      where: { id: params.itemId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting checklist item:', error)
    return NextResponse.json(
      { error: 'Failed to delete checklist item' },
      { status: 500 }
    )
  }
}

