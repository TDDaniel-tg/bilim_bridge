import { University } from '@prisma/client'
import { ChecklistItemCategory } from '@prisma/client'

interface ChecklistItemTemplate {
  title: string
  description?: string
  category: ChecklistItemCategory
  order: number
  deadlineOffset?: number // Days before main deadline
}

export function generateChecklistItems(university: University): ChecklistItemTemplate[] {
  const items: ChecklistItemTemplate[] = []
  let order = 1

  // DOCUMENTS
  if (university.minIelts || university.minToefl) {
    items.push({
      title: `Take English proficiency test (${university.minIelts ? `IELTS ${university.minIelts}+` : ''} ${university.minToefl ? `TOEFL ${university.minToefl}+` : ''})`,
      description: 'Register and take the test at least 2 months before application deadline',
      category: 'DOCUMENTS',
      order: order++,
      deadlineOffset: 60
    })
  }

  if (university.minSat || university.avgSat25) {
    items.push({
      title: `Take SAT (target: ${university.avgSat25 || university.minSat}+)`,
      description: 'Register early and consider taking it twice to improve your score',
      category: 'DOCUMENTS',
      order: order++,
      deadlineOffset: 45
    })
  }

  if (university.minAct) {
    items.push({
      title: `Take ACT (minimum: ${university.minAct})`,
      description: 'Alternative to SAT, check which test suits you better',
      category: 'DOCUMENTS',
      order: order++,
      deadlineOffset: 45
    })
  }

  items.push({
    title: 'Request official transcript from your school',
    description: 'Get your academic records certified and ready to send',
    category: 'DOCUMENTS',
    order: order++,
    deadlineOffset: 30
  })

  if (university.recommendationCount && university.recommendationCount > 0) {
    items.push({
      title: `Get ${university.recommendationCount} recommendation letters`,
      description: 'Ask teachers/mentors who know you well, at least 1 month in advance',
      category: 'DOCUMENTS',
      order: order++,
      deadlineOffset: 45
    })
  } else {
    items.push({
      title: 'Get 2-3 recommendation letters',
      description: 'Most universities require letters from teachers or mentors',
      category: 'DOCUMENTS',
      order: order++,
      deadlineOffset: 45
    })
  }

  items.push({
    title: 'Prepare CV/Resume',
    description: 'List your extracurriculars, achievements, work experience',
    category: 'DOCUMENTS',
    order: order++,
    deadlineOffset: 20
  })

  if (university.requiresPortfolio) {
    items.push({
      title: 'Prepare portfolio',
      description: 'Required for creative programs - compile your best work',
      category: 'DOCUMENTS',
      order: order++,
      deadlineOffset: 30
    })
  }

  // ESSAYS
  if (university.acceptsCommonApp) {
    items.push({
      title: 'Write Common App Personal Statement (650 words)',
      description: 'Choose from 7 prompts, make it personal and compelling',
      category: 'ESSAYS',
      order: order++,
      deadlineOffset: 30
    })
  }

  if (university.requiresStatement && !university.acceptsCommonApp) {
    items.push({
      title: 'Write Personal Statement',
      description: 'Check university website for specific prompts and word limits',
      category: 'ESSAYS',
      order: order++,
      deadlineOffset: 30
    })
  }

  const supplementals = university.supplementalEssays as any[]
  if (supplementals && supplementals.length > 0) {
    supplementals.forEach((essay, index) => {
      items.push({
        title: `Write Supplemental Essay #${index + 1}${essay.topic ? `: ${essay.topic}` : ''}`,
        description: essay.wordCount ? `Word limit: ${essay.wordCount} words` : undefined,
        category: 'ESSAYS',
        order: order++,
        deadlineOffset: 25
      })
    })
  } else if (university.requiresStatement) {
    items.push({
      title: 'Write supplemental essays',
      description: 'Check university website for specific requirements',
      category: 'ESSAYS',
      order: order++,
      deadlineOffset: 25
    })
  }

  items.push({
    title: 'Review and edit all essays',
    description: 'Get feedback from teachers, mentors, or use AI assistant',
    category: 'ESSAYS',
    order: order++,
    deadlineOffset: 15
  })

  // APPLICATION
  if (university.acceptsCommonApp) {
    items.push({
      title: 'Create Common App account',
      description: 'Register at commonapp.org and start your profile',
      category: 'APPLICATION',
      order: order++,
      deadlineOffset: 40
    })

    items.push({
      title: 'Complete Common App profile',
      description: 'Fill in all sections: personal info, family, education, activities',
      category: 'APPLICATION',
      order: order++,
      deadlineOffset: 35
    })
  } else if (university.acceptsCoalition) {
    items.push({
      title: 'Create Coalition App account',
      description: 'Register and start your profile',
      category: 'APPLICATION',
      order: order++,
      deadlineOffset: 40
    })
  } else if (university.hasOwnSystem) {
    items.push({
      title: `Register on ${university.nameEn} application portal`,
      description: university.ownSystemLink ? `Visit: ${university.ownSystemLink}` : 'Check university website for application portal',
      category: 'APPLICATION',
      order: order++,
      deadlineOffset: 40
    })
  }

  items.push({
    title: 'Upload all required documents',
    description: 'Transcripts, test scores, essays, CV, recommendations',
    category: 'APPLICATION',
    order: order++,
    deadlineOffset: 10
  })

  items.push({
    title: 'Send official test scores',
    description: 'Order official score reports from testing agencies to university',
    category: 'APPLICATION',
    order: order++,
    deadlineOffset: 15
  })

  items.push({
    title: 'Pay application fee or request fee waiver',
    description: 'Check if you qualify for fee waiver, otherwise prepare to pay online',
    category: 'APPLICATION',
    order: order++,
    deadlineOffset: 5
  })

  items.push({
    title: 'Review application thoroughly',
    description: 'Check all information, documents, and essays before submission',
    category: 'APPLICATION',
    order: order++,
    deadlineOffset: 3
  })

  items.push({
    title: 'Submit application!',
    description: 'Double-check everything and hit submit before deadline',
    category: 'APPLICATION',
    order: order++,
    deadlineOffset: 0
  })

  // FINANCIAL AID
  if (university.requiresCssProfile) {
    items.push({
      title: 'Complete CSS Profile',
      description: 'Required for financial aid - register at collegeboard.org',
      category: 'FINANCIAL_AID',
      order: order++,
      deadlineOffset: 20
    })

    items.push({
      title: 'Gather financial documents for CSS Profile',
      description: 'Tax returns, bank statements, property information',
      category: 'FINANCIAL_AID',
      order: order++,
      deadlineOffset: 25
    })
  }

  if (university.hasMeritScholarships || university.hasFullRide) {
    items.push({
      title: 'Apply for merit-based scholarships',
      description: 'Check university website for available scholarships and deadlines',
      category: 'FINANCIAL_AID',
      order: order++,
      deadlineOffset: 20
    })
  }

  if (university.hasNeedBased) {
    items.push({
      title: 'Submit financial aid application',
      description: 'Complete all required forms for need-based aid',
      category: 'FINANCIAL_AID',
      order: order++,
      deadlineOffset: 20
    })
  }

  // POST SUBMISSION
  items.push({
    title: 'Check application portal regularly',
    description: 'Monitor for requests for additional documents or updates',
    category: 'POST_SUBMISSION',
    order: order++
  })

  if (university.requiresInterview) {
    items.push({
      title: 'Prepare for interview',
      description: 'Practice common questions, research the university thoroughly',
      category: 'POST_SUBMISSION',
      order: order++
    })
  }

  items.push({
    title: 'Send additional materials if requested',
    description: 'Respond promptly to any requests from admissions office',
    category: 'POST_SUBMISSION',
    order: order++
  })

  items.push({
    title: 'Wait for decision and celebrate! 🎉',
    description: 'Decisions typically come out in March-April for regular decision',
    category: 'POST_SUBMISSION',
    order: order++
  })

  return items
}

export function calculateDeadline(baseDeadline: Date, offsetDays: number): Date {
  const deadline = new Date(baseDeadline)
  deadline.setDate(deadline.getDate() - offsetDays)
  return deadline
}

