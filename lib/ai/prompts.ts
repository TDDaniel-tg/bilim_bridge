export const CHAT_PROMPTS = {
  university_search: `Help the student find universities that match their profile and preferences. Consider:
- Academic requirements (GPA, test scores)
- Financial fit (tuition, scholarships)
- Location preferences
- Major availability
- Acceptance rates

Categorize recommendations as Reach, Target, and Safety schools.`,

  chances_evaluation: `Evaluate the student's chances of admission to specific universities. Consider:
- Academic profile vs. university averages
- Extracurricular activities
- Financial need and aid availability
- International student acceptance rates
- Application strength

Be realistic but encouraging. Provide specific advice on how to strengthen their application.`,

  essay_feedback: `Review the essay and provide constructive feedback. Focus on:
1. Structure and organization
2. Clarity of main idea
3. Use of specific examples
4. Writing style and tone
5. Grammar and mechanics
6. Overall impact

IMPORTANT: Never rewrite the essay. Only provide feedback and suggestions.`,

  scholarship_search: `Help the student find scholarship opportunities. Consider:
- Academic merit
- Financial need
- Country/region specific scholarships
- Major-specific scholarships
- University-specific aid
- External scholarship programs

Provide specific names and brief descriptions of scholarships.`,

  deadline_reminder: `Provide information about application deadlines. Include:
- Early Action/Early Decision dates
- Regular Decision deadlines
- Financial aid deadlines
- Scholarship deadlines
- International student specific deadlines

Organize chronologically and highlight approaching deadlines.`,

  common_app_help: `Explain how to use Common Application. Cover:
- Registration process
- Filling out the profile
- Activities section
- Essay prompts
- Recommendations
- Transcript submission
- Application fee and waivers
- Submitting to multiple universities

Provide step-by-step guidance.`,

  css_profile_help: `Explain CSS Profile for financial aid. Cover:
- What it is and who needs it
- Registration and fees
- Documents required
- How to fill it out
- Submission to universities
- International student considerations

Be clear and specific.`,

  interview_prep: `Provide guidance for university interviews. Include:
- Common interview questions
- How to prepare
- What to wear
- Interview etiquette
- Questions to ask the interviewer
- Follow-up

Boost the student's confidence.`,
}

export function getPromptTemplate(type: keyof typeof CHAT_PROMPTS): string {
  return CHAT_PROMPTS[type] || ''
}

export function buildUniversityContext(university: any): string {
  return `
University: ${university.nameEn}
Country: ${university.country}
City: ${university.city}
${university.avgGpa ? `Average GPA: ${university.avgGpa}` : ''}
${university.avgSat25 && university.avgSat75 ? `SAT Range: ${university.avgSat25}-${university.avgSat75}` : ''}
${university.minIelts ? `Min IELTS: ${university.minIelts}` : ''}
${university.minToefl ? `Min TOEFL: ${university.minToefl}` : ''}
${university.acceptanceRate ? `Acceptance Rate: ${university.acceptanceRate}%` : ''}
${university.tuitionIntl ? `Tuition: $${university.tuitionIntl}/year` : ''}
${university.hasMeritScholarships ? 'Merit Scholarships: Available' : ''}
${university.hasNeedBased ? 'Need-based Aid: Available' : ''}
${university.hasFullRide ? 'Full-ride Scholarships: Available' : ''}
${university.earlyActionDate ? `Early Action Deadline: ${university.earlyActionDate}` : ''}
${university.regularDeadline ? `Regular Decision Deadline: ${university.regularDeadline}` : ''}
`.trim()
}

