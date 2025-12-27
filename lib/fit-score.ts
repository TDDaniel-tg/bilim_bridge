import { StudentProfile, University } from '@prisma/client'

interface FitScoreResult {
  score: number
  category: 'reach' | 'target' | 'safety'
  breakdown: {
    academic: number
    extracurricular: number
    financial: number
  }
  explanation: {
    strengths: string[]
    improvements: string[]
    recommendations: string[]
  }
}

export function calculateFitScore(
  profile: StudentProfile,
  university: University
): FitScoreResult {
  // Academic Score (40% weight)
  const academicScore = calculateAcademicScore(profile, university)

  // Extracurricular Score (30% weight)
  const extracurricularScore = calculateExtracurricularScore(profile)

  // Financial Score (30% weight)
  const financialScore = calculateFinancialScore(profile, university)

  // Total Score
  const totalScore = Math.round(
    academicScore * 0.4 + extracurricularScore * 0.3 + financialScore * 0.3
  )

  // Determine Category
  const category = 
    totalScore <= 40 ? 'reach' : 
    totalScore <= 70 ? 'target' : 
    'safety'

  // Generate Explanation
  const explanation = generateExplanation(
    profile,
    university,
    { academic: academicScore, extracurricular: extracurricularScore, financial: financialScore }
  )

  return {
    score: totalScore,
    category,
    breakdown: {
      academic: Math.round(academicScore),
      extracurricular: Math.round(extracurricularScore),
      financial: Math.round(financialScore),
    },
    explanation,
  }
}

function calculateAcademicScore(profile: StudentProfile, university: University): number {
  let score = 0
  let factors = 0

  // GPA Score
  if (profile.gpa && university.avgGpa) {
    factors++
    if (profile.gpa >= university.avgGpa + 0.2) {
      score += 100
    } else if (profile.gpa >= university.avgGpa) {
      score += 85
    } else if (profile.gpa >= (university.minGpa || university.avgGpa - 0.3)) {
      score += 65
    } else {
      score += 40
    }
  }

  // SAT Score
  if (profile.satTotal && university.avgSat25 && university.avgSat75) {
    factors++
    const avgSat = (university.avgSat25 + university.avgSat75) / 2
    if (profile.satTotal >= university.avgSat75) {
      score += 100
    } else if (profile.satTotal >= avgSat) {
      score += 80
    } else if (profile.satTotal >= university.avgSat25) {
      score += 60
    } else if (profile.satTotal >= (university.minSat || 0)) {
      score += 45
    } else {
      score += 30
    }
  }

  // IELTS Score
  if (profile.ieltsTotal && university.minIelts) {
    factors++
    if (profile.ieltsTotal >= university.minIelts + 1.0) {
      score += 100
    } else if (profile.ieltsTotal >= university.minIelts + 0.5) {
      score += 85
    } else if (profile.ieltsTotal >= university.minIelts) {
      score += 70
    } else {
      score += 30
    }
  }

  // TOEFL Score
  if (profile.toeflTotal && university.minToefl) {
    factors++
    if (profile.toeflTotal >= university.minToefl + 15) {
      score += 100
    } else if (profile.toeflTotal >= university.minToefl + 5) {
      score += 85
    } else if (profile.toeflTotal >= university.minToefl) {
      score += 70
    } else {
      score += 30
    }
  }

  return factors > 0 ? score / factors : 50
}

function calculateExtracurricularScore(profile: StudentProfile): number {
  let score = 50 // Base score

  const extracurriculars = (profile.extracurriculars as any[]) || []
  const achievements = (profile.achievements as any[]) || []
  const leadership = (profile.leadership as any[]) || []
  const volunteerWork = (profile.volunteerWork as any[]) || []

  // Extracurricular activities (max 30 points)
  if (extracurriculars.length >= 5) score += 30
  else if (extracurriculars.length >= 3) score += 20
  else if (extracurriculars.length >= 1) score += 10

  // Achievements (max 25 points)
  if (achievements.length >= 5) score += 25
  else if (achievements.length >= 3) score += 15
  else if (achievements.length >= 1) score += 8

  // Leadership (max 25 points)
  if (leadership.length >= 3) score += 25
  else if (leadership.length >= 2) score += 15
  else if (leadership.length >= 1) score += 10

  // Volunteer work (max 20 points)
  if (volunteerWork.length >= 3) score += 20
  else if (volunteerWork.length >= 2) score += 12
  else if (volunteerWork.length >= 1) score += 7

  return Math.min(score, 100)
}

function calculateFinancialScore(profile: StudentProfile, university: University): number {
  const totalCost = university.totalCost || university.tuitionIntl || 0
  const budget = profile.maxBudget || 0

  // If student doesn't need financial aid and can afford
  if (!profile.needFinancialAid && budget >= totalCost) {
    return 100
  }

  // If student needs aid
  if (profile.needFinancialAid) {
    let score = 40 // Base score for needing aid

    // Check available financial aid
    if (university.hasFullRide) score += 30
    if (university.hasMeritScholarships) score += 20
    if (university.hasNeedBased) score += 25

    // Check affordability with partial aid
    const expectedAid = (university.finAidPercentage || 0) / 100 * totalCost
    const remainingCost = totalCost - expectedAid
    
    if (budget >= remainingCost) score += 20
    else if (budget >= remainingCost * 0.7) score += 10

    return Math.min(score, 100)
  }

  // Partial affordability
  const affordabilityRatio = budget / totalCost
  if (affordabilityRatio >= 0.8) return 75
  if (affordabilityRatio >= 0.6) return 60
  if (affordabilityRatio >= 0.4) return 45
  return 30
}

function generateExplanation(
  profile: StudentProfile,
  university: University,
  breakdown: { academic: number; extracurricular: number; financial: number }
): { strengths: string[]; improvements: string[]; recommendations: string[] } {
  const strengths: string[] = []
  const improvements: string[] = []
  const recommendations: string[] = []

  // Academic strengths and improvements
  if (profile.gpa && university.avgGpa) {
    if (profile.gpa >= university.avgGpa) {
      strengths.push(`Your GPA (${profile.gpa.toFixed(2)}) exceeds the average (${university.avgGpa.toFixed(2)})`)
    } else {
      improvements.push(`Your GPA (${profile.gpa.toFixed(2)}) is below the average (${university.avgGpa.toFixed(2)})`)
      recommendations.push("Focus on maintaining or improving your GPA in remaining semesters")
    }
  }

  if (profile.satTotal && university.avgSat25 && university.avgSat75) {
    const avgSat = (university.avgSat25 + university.avgSat75) / 2
    if (profile.satTotal >= avgSat) {
      strengths.push(`Your SAT score (${profile.satTotal}) meets or exceeds the average (${Math.round(avgSat)})`)
    } else {
      improvements.push(`Your SAT score (${profile.satTotal}) is below the average (${Math.round(avgSat)})`)
      recommendations.push("Consider retaking the SAT to improve your score")
    }
  }

  if (profile.ieltsTotal && university.minIelts) {
    if (profile.ieltsTotal >= university.minIelts) {
      strengths.push(`Your IELTS score (${profile.ieltsTotal}) meets requirements (min ${university.minIelts})`)
    } else {
      improvements.push(`Your IELTS score (${profile.ieltsTotal}) is below requirements (min ${university.minIelts})`)
      recommendations.push("You must achieve the minimum IELTS score to be eligible")
    }
  }

  // Extracurricular strengths
  const extracurriculars = (profile.extracurriculars as any[]) || []
  const leadership = (profile.leadership as any[]) || []
  
  if (extracurriculars.length >= 3) {
    strengths.push("Strong extracurricular profile demonstrates diverse interests")
  } else if (extracurriculars.length < 2) {
    improvements.push("Limited extracurricular activities")
    recommendations.push("Engage in meaningful extracurricular activities that align with your interests")
  }

  if (leadership.length >= 1) {
    strengths.push("Leadership experience strengthens your application")
  } else {
    recommendations.push("Seek leadership positions in clubs or organizations")
  }

  // Financial fit
  if (university.hasFullRide) {
    strengths.push("Full-ride scholarships available for exceptional candidates")
  }

  if (profile.needFinancialAid && !university.hasNeedBased) {
    improvements.push("Limited need-based financial aid available for international students")
    recommendations.push("Apply to additional universities with better financial aid for international students")
  }

  // Overall recommendations based on category
  if (breakdown.academic < 50) {
    recommendations.push("Consider this a reach school and also apply to target/safety schools")
  }

  if (university.acceptsCommonApp) {
    recommendations.push("This university accepts Common App, making application easier")
  }

  return { strengths, improvements, recommendations }
}

