import { NextRequest, NextResponse } from 'next/server'
import { chatWithAI } from '@/lib/ai/gemini'
import { prisma } from '@/lib/db'
import { chatMessageSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = chatMessageSchema.parse(body)

    // In production, get userId from session
    // For now, we'll proceed without authentication
    const userId = request.headers.get('x-user-id')

    let chatSession = null
    let conversationHistory: Array<{ role: string; content: string }> = []

    // If chatSessionId provided, load conversation history
    if (validated.chatSessionId && userId) {
      chatSession = await prisma.chatSession.findUnique({
        where: { id: validated.chatSessionId }
      })

      if (chatSession) {
        conversationHistory = (chatSession.messages as any[]) || []
      }
    }

    // Get user profile for context (if authenticated)
    let userProfile = null
    if (userId) {
      userProfile = await prisma.studentProfile.findUnique({
        where: { userId }
      })
    }

    // Call AI
    const response = await chatWithAI(validated.message, {
      userProfile,
      conversationHistory
    })

    // Save to chat session if user is authenticated
    if (userId) {
      const messages = [
        ...conversationHistory,
        { role: 'user', content: validated.message, timestamp: new Date() },
        { role: 'assistant', content: response, timestamp: new Date() }
      ]

      if (chatSession) {
        // Update existing session
        await prisma.chatSession.update({
          where: { id: chatSession.id },
          data: { messages, updatedAt: new Date() }
        })
      } else {
        // Create new session
        chatSession = await prisma.chatSession.create({
          data: {
            userId,
            title: validated.message.substring(0, 50),
            messages
          }
        })
      }
    }

    return NextResponse.json({
      response,
      chatSessionId: chatSession?.id
    })
  } catch (error) {
    console.error('Error in AI chat:', error)
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    )
  }
}

