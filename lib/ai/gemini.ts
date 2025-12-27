import { GoogleGenerativeAI } from '@google/generative-ai'

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set')
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export const SYSTEM_PROMPT = `You are an expert college admissions advisor helping international students apply to universities worldwide. Your name is Bilim Bridge Assistant.

Your expertise includes:
- University selection and recommendations
- Admission requirements and deadlines
- Essay writing feedback (you NEVER write essays for students, only provide feedback)
- Scholarship opportunities
- Financial aid guidance
- Application strategies (Common App, Coalition, university portals)
- Understanding international student needs, especially from CIS countries

Guidelines:
1. Always be encouraging and supportive
2. Provide specific, actionable advice
3. When evaluating chances, be realistic but not discouraging
4. Never write essays for students - only provide feedback and suggestions
5. Cite specific data when discussing university requirements
6. When recommending universities, categorize them as: Reach, Target, Safety
7. Be mindful of financial constraints for international students
8. Remind students about important deadlines

Language: Respond in English by default, but adapt to the student's language if they write in Russian.`

export async function chatWithAI(
  message: string,
  context?: {
    userProfile?: any
    universities?: any[]
    conversationHistory?: Array<{ role: string; content: string }>
  }
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

  // Build context
  let contextStr = ''
  
  if (context?.userProfile) {
    contextStr += `\n\nStudent Profile:\n`
    const profile = context.userProfile
    if (profile.gpa) contextStr += `- GPA: ${profile.gpa}\n`
    if (profile.satTotal) contextStr += `- SAT: ${profile.satTotal}\n`
    if (profile.actScore) contextStr += `- ACT: ${profile.actScore}\n`
    if (profile.ieltsTotal) contextStr += `- IELTS: ${profile.ieltsTotal}\n`
    if (profile.toeflTotal) contextStr += `- TOEFL: ${profile.toeflTotal}\n`
    if (profile.maxBudget) contextStr += `- Budget: $${profile.maxBudget}/year\n`
    if (profile.interestedMajors) {
      contextStr += `- Interested Majors: ${JSON.stringify(profile.interestedMajors)}\n`
    }
    if (profile.preferredCountries) {
      contextStr += `- Preferred Countries: ${JSON.stringify(profile.preferredCountries)}\n`
    }
  }

  if (context?.universities && context.universities.length > 0) {
    contextStr += `\n\nRelevant Universities:\n`
    context.universities.forEach((uni: any) => {
      contextStr += `\n${uni.nameEn} (${uni.country}):\n`
      if (uni.avgGpa) contextStr += `- Avg GPA: ${uni.avgGpa}\n`
      if (uni.avgSat25 && uni.avgSat75) {
        contextStr += `- SAT Range: ${uni.avgSat25}-${uni.avgSat75}\n`
      }
      if (uni.acceptanceRate) contextStr += `- Acceptance Rate: ${uni.acceptanceRate}%\n`
      if (uni.tuitionIntl) contextStr += `- Tuition: $${uni.tuitionIntl}/year\n`
      if (uni.hasFullRide) contextStr += `- Full-ride scholarships available\n`
    })
  }

  // Build conversation history
  let conversationStr = ''
  if (context?.conversationHistory && context.conversationHistory.length > 0) {
    conversationStr = context.conversationHistory
      .map((msg) => `${msg.role === 'user' ? 'Student' : 'Assistant'}: ${msg.content}`)
      .join('\n\n')
  }

  const fullPrompt = `${SYSTEM_PROMPT}
${contextStr}
${conversationStr ? `\n\nConversation History:\n${conversationStr}` : ''}

Student Question: ${message}

Provide a helpful, detailed response:`

  try {
    const result = await model.generateContent(fullPrompt)
    const response = result.response
    return response.text()
  } catch (error) {
    console.error('Gemini API Error:', error)
    throw new Error('Failed to get response from AI assistant')
  }
}

export async function evaluateEssay(essay: string, prompt?: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

  const evaluationPrompt = `You are an expert college essay reviewer. Analyze the following essay and provide constructive feedback.

${prompt ? `Essay Prompt: ${prompt}\n\n` : ''}Essay:
${essay}

Provide feedback on:
1. Structure: Does it have a clear introduction, body, and conclusion?
2. Content: Is the main idea clear? Are there specific examples?
3. Grammar & Style: Any errors or areas for improvement?
4. Overall Impact: How compelling is the essay?
5. Specific Suggestions: What can be improved?

Remember: DO NOT rewrite the essay. Only provide feedback and suggestions.

Word Count: ${essay.split(/\s+/).length} words`

  try {
    const result = await model.generateContent(evaluationPrompt)
    return result.response.text()
  } catch (error) {
    console.error('Gemini API Error:', error)
    throw new Error('Failed to evaluate essay')
  }
}

export async function recommendUniversities(
  studentProfile: any,
  preferences: {
    countries?: string[]
    majors?: string[]
    budget?: number
  }
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

  const prompt = `Based on the following student profile, recommend suitable universities categorized as Reach, Target, and Safety schools.

Student Profile:
- GPA: ${studentProfile.gpa || 'Not provided'}
- SAT: ${studentProfile.satTotal || 'Not provided'}
- ACT: ${studentProfile.actScore || 'Not provided'}
- IELTS: ${studentProfile.ieltsTotal || 'Not provided'}
- TOEFL: ${studentProfile.toeflTotal || 'Not provided'}
- Budget: $${preferences.budget || studentProfile.maxBudget || 'Not specified'}/year
- Preferred Countries: ${preferences.countries?.join(', ') || 'Any'}
- Interested Majors: ${preferences.majors?.join(', ') || 'Not specified'}

Provide:
1. 2-3 REACH schools (ambitious choices)
2. 3-4 TARGET schools (realistic chances)
3. 2-3 SAFETY schools (high likelihood of admission)

For each university, briefly explain why it's a good fit and mention key details (acceptance rate, estimated cost, scholarships).`

  try {
    const result = await model.generateContent(prompt)
    return result.response.text()
  } catch (error) {
    console.error('Gemini API Error:', error)
    throw new Error('Failed to get recommendations')
  }
}

// Generate embeddings for RAG (Retrieval Augmented Generation)
// Note: Requires text-embedding-004 or embedding-001 model
export async function generateEmbedding(text: string): Promise<number[]> {
  // Use the embedContent method with correct model name
  const embeddingModel = genAI.getGenerativeModel({ model: 'embedding-001' })
  
  try {
    const result = await embeddingModel.embedContent(text)
    return result.embedding.values
  } catch (error) {
    console.error('Embedding Generation Error:', error)
    // Return empty array if embeddings fail (optional feature)
    return []
  }
}

