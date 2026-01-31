// Ranking systems for universities
export const RANKING_SYSTEMS = [
    { value: 'QS', label: 'QS World University Rankings' },
    { value: 'US_NEWS', label: 'US News & World Report' },
    { value: 'THE', label: 'Times Higher Education' },
    { value: 'ARWU', label: 'Academic Ranking of World Universities (Shanghai)' },
    { value: 'NICHE', label: 'Niche College Rankings' },
    { value: 'CUSTOM', label: 'Other/Custom Ranking' },
] as const

export type RankingSystem = typeof RANKING_SYSTEMS[number]['value']

// Get current year for default values
export const getCurrentYear = () => new Date().getFullYear()

// Validate year is reasonable
export function isValidYear(year: number): boolean {
    const currentYear = getCurrentYear()
    return year >= 1000 && year <= currentYear + 1
}
