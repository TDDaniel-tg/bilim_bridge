import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

interface UniversityData {
    name: string
    country: string
    city: string
    website?: string
    email?: string
    phone?: string
    description?: string
    tuitionInternational?: number
    acceptanceRate?: number
    ranking?: Record<string, any>
    scholarships?: Record<string, any>
}

async function parseUSAFile(filePath: string): Promise<UniversityData[]> {
    const content = fs.readFileSync(filePath, 'utf-8')
    const lines = content.split('\n')
    const universities: UniversityData[] = []

    // Skip header and metadata rows (rows 1-3)
    for (let i = 3; i < lines.length; i++) {
        const line = lines[i].trim()
        if (!line) continue

        const columns = line.split('\t')

        // Extract university name and location from first column
        const nameLocation = columns[0] || ''
        if (nameLocation.includes('DREAM UNIVERSITIES') || nameLocation.includes('Orange -')) continue

        const name = nameLocation.split(',')[0]?.trim()
        if (!name) continue

        // Parse location (city, state)
        const locationMatch = columns[4]?.match(/(.+),\s*(.+)/)
        const city = locationMatch ? locationMatch[1].trim() : columns[4] || ''
        const state = locationMatch ? locationMatch[2].trim() : ''

        // Parse acceptance rate
        const acceptanceRate = parseFloat(columns[5]) || undefined

        // Parse tuition
        const tuitionText = columns[12] || ''
        const tuitionMatch = tuitionText.match(/\$?([\d,]+)/)
        const tuition = tuitionMatch ? parseInt(tuitionMatch[1].replace(/,/g, '')) : undefined

        // Parse scholarships info
        const scholarshipInfo = {
            needBased: columns[14] || '',
            meritBased: columns[15] || '',
            percentage: columns[16] || '',
            averageAmount: columns[17] || ''
        }

        // Parse ranking
        const rankingText = columns[3] || ''
        const rankingMatch = rankingText.match(/#(\d+)/)
        const ranking = rankingMatch ? {
            "US News National": parseInt(rankingMatch[1])
        } : {}

        universities.push({
            name,
            country: 'United States',
            city,
            website: columns[20] || undefined,
            email: undefined,
            phone: undefined,
            description: columns[1] || undefined,
            tuitionInternational: tuition,
            acceptanceRate,
            ranking: Object.keys(ranking).length > 0 ? ranking : undefined,
            scholarships: scholarshipInfo.needBased || scholarshipInfo.meritBased ? scholarshipInfo : undefined
        })
    }

    return universities.filter(u => u.name && u.name.length > 3)
}

async function parseChinaFile(filePath: string): Promise<UniversityData[]> {
    const content = fs.readFileSync(filePath, 'utf-8')
    const lines = content.split('\n')
    const universities: UniversityData[] = []

    // Skip header rows
    for (let i = 3; i < lines.length; i++) {
        const line = lines[i].trim()
        if (!line) continue

        const columns = line.split('\t')

        const name = columns[0]?.trim()
        if (!name || name.length < 3) continue

        const city = columns[1]?.trim() || ''

        // Parse ranking
        const worldRanking = columns[2] || ''
        const uniRanking = columns[3] || ''

        const ranking: Record<string, string> = {}
        if (worldRanking) ranking['World University Rankings'] = worldRanking
        if (uniRanking) ranking['QS World University Rankings'] = uniRanking

        // Parse tuition
        const tuitionText = columns[9] || ''
        const tuitionMatch = tuitionText.match(/(\d[\d,]*)/)
        const tuition = tuitionMatch ? parseInt(tuitionMatch[1].replace(/,/g, '')) : undefined

        universities.push({
            name,
            country: 'China',
            city,
            website: columns[8] || undefined,
            email: undefined,
            phone: columns[11] || undefined,
            description: columns[4] || undefined,
            tuitionInternational: tuition,
            ranking: Object.keys(ranking).length > 0 ? ranking : undefined,
            scholarships: columns[10] ? { info: columns[10] } : undefined
        })
    }

    return universities.filter(u => u.name && u.name.length > 3)
}

async function parseKoreaFile(filePath: string): Promise<UniversityData[]> {
    const content = fs.readFileSync(filePath, 'utf-8')
    const lines = content.split('\n')
    const universities: UniversityData[] = []

    // Skip headers (first 2 rows)
    for (let i = 2; i < lines.length; i++) {
        const line = lines[i].trim()
        if (!line) continue

        const columns = line.split('\t')

        const name = columns[1]?.trim()
        if (!name || name.length < 3) continue

        const city = columns[2]?.trim() || ''

        // Parse tuition
        const tuitionText = columns[3] || ''
        const tuitionMatch = tuitionText.match(/(\d[\d,]*)/)
        const tuition = tuitionMatch ? parseInt(tuitionMatch[1].replace(/,/g, '')) : undefined

        // Parse acceptance rate
        const acceptanceText = columns[4] || ''
        const acceptanceMatch = acceptanceText.match(/0\.(\d+)/)
        const acceptanceRate = acceptanceMatch ? parseFloat(`0.${acceptanceMatch[1]}`) : undefined

        // Parse ranking
        const countryRank = columns[18] || ''
        const worldRank = columns[19] || ''
        const ranking: Record<string, any> = {}
        if (countryRank) ranking['Country Rank'] = countryRank
        if (worldRank) ranking['World Rank'] = worldRank

        universities.push({
            name,
            country: 'South Korea',
            city,
            website: columns[16] || undefined,
            email: undefined,
            phone: undefined,
            description: '',
            tuitionInternational: tuition,
            acceptanceRate,
            ranking: Object.keys(ranking).length > 0 ? ranking : undefined,
            scholarships: columns[5] ? { maxAmount: columns[5] } : undefined
        })
    }

    return universities.filter(u => u.name && u.name.length > 3)
}

async function importUniversities() {
    try {
        console.log('🚀 Starting university import...\n')

        const baseDir = '/Users/daniel/Desktop/my/bilim_bridge'

        // Parse all files
        console.log('📚 Parsing USA universities...')
        const usaUniversities = await parseUSAFile(path.join(baseDir, 'USA.txt'))
        console.log(`  ✓ Found ${usaUniversities.length} USA universities\n`)

        console.log('📚 Parsing China universities...')
        const chinaUniversities = await parseChinaFile(path.join(baseDir, 'China.txt'))
        console.log(`  ✓ Found ${chinaUniversities.length} China universities\n`)

        console.log('📚 Parsing South Korea universities...')
        const koreaUniversities = await parseKoreaFile(path.join(baseDir, 'South Korea.txt'))
        console.log(`  ✓ Found ${koreaUniversities.length} South Korea universities\n`)

        const allUniversities = [...usaUniversities, ...chinaUniversities, ...koreaUniversities]

        console.log(`📊 Total universities to import: ${allUniversities.length}\n`)
        console.log('💾 Importing to database...\n')

        let imported = 0
        let skipped = 0
        let errors = 0

        for (const university of allUniversities) {
            try {
                // Check if university already exists
                const existing = await prisma.university.findFirst({
                    where: {
                        nameEn: university.name,
                        country: university.country
                    }
                })

                if (existing) {
                    console.log(`  ⏭️  Skipped: ${university.name} (already exists)`)
                    skipped++
                    continue
                }

                // Create university
                await prisma.university.create({
                    data: {
                        nameEn: university.name,
                        country: university.country,
                        city: university.city,
                        website: university.website,
                        admissionEmail: university.email,
                        admissionPhone: university.phone,
                        tuitionIntl: university.tuitionInternational,
                        acceptanceRate: university.acceptanceRate,
                        customRankings: university.ranking ? JSON.stringify([university.ranking]) : undefined,
                    }
                })

                console.log(`  ✓ Imported: ${university.name}`)
                imported++
            } catch (error) {
                console.error(`  ✗ Error importing ${university.name}:`, error)
                errors++
            }
        }

        console.log(`\n✅ Import complete!`)
        console.log(`   Imported: ${imported}`)
        console.log(`   Skipped: ${skipped}`)
        console.log(`   Errors: ${errors}`)

    } catch (error) {
        console.error('❌ Fatal error during import:', error)
        throw error
    } finally {
        await prisma.$disconnect()
    }
}

// Run the import
importUniversities()
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
