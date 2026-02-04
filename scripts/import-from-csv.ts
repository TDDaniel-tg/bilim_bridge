import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'

const prisma = new PrismaClient()

// More robust CSV parser that handles multiline cells and quoted fields
function parseCSV(content: string): string[][] {
    const rows: string[][] = []
    let currentRow: string[] = []
    let currentCell = ''
    let insideQuotes = false

    for (let i = 0; i < content.length; i++) {
        const char = content[i]
        const nextChar = content[i + 1]

        if (char === '"') {
            if (insideQuotes && nextChar === '"') {
                // Escaped quote
                currentCell += '"'
                i++ // Skip next quote
            } else {
                // Toggle quote mode
                insideQuotes = !insideQuotes
            }
        } else if (char === ',' && !insideQuotes) {
            // End of cell
            currentRow.push(currentCell)
            currentCell = ''
        } else if ((char === '\n' || char === '\r') && !insideQuotes) {
            // End of row (handle both \n and \r\n)
            if (char === '\r' && nextChar === '\n') {
                i++ // Skip \n in \r\n
            }

            if (currentCell || currentRow.length > 0) {
                currentRow.push(currentCell)
                if (currentRow.some(cell => cell.trim())) {
                    rows.push(currentRow)
                }
                currentRow = []
                currentCell = ''
            }
        } else {
            currentCell += char
        }
    }

    // Don't forget last cell/row
    if (currentCell || currentRow.length > 0) {
        currentRow.push(currentCell)
        if (currentRow.some(cell => cell.trim())) {
            rows.push(currentRow)
        }
    }

    return rows
}

function extractUniversityName(nameField: string): string {
    // Remove parenthetical notes like "(lack money)", "(limited aid)", etc.
    const match = nameField.match(/^([^(]+)/)
    return match ? match[1].trim() : nameField.trim()
}

function parseAcceptanceRate(rate: string): number | undefined {
    if (!rate) return undefined

    const cleaned = rate.replace('%', '').replace(',', '.').trim()
    const num = parseFloat(cleaned)

    if (isNaN(num)) return undefined

    // Convert to decimal if needed
    return num > 1 ? num / 100 : num
}

function parseMoney(value: string): number | undefined {
    if (!value) return undefined

    // Extract first number, handle formats like "$56,854" or "56K" or "$21,000"
    const kMatch = value.match(/([\d,]+)K/i)
    if (kMatch) {
        return parseInt(kMatch[1].replace(/,/g, '')) * 1000
    }

    const match = value.match(/\$?([\d,]+)/)
    if (!match) return undefined

    return parseInt(match[1].replace(/,/g, ''))
}

function extractMinScore(text: string, type: 'TOEFL' | 'IELTS' | 'SAT' | 'ACT'): number | undefined {
    if (!text) return undefined

    // Patterns: "TOEFL 100", "IELTS 7.0", "SAT 1400", "ACT 32"
    const pattern = new RegExp(`${type}[:\\s]+(\\d+(?:\\.\\d+)?)`, 'i')
    const match = text.match(pattern)

    if (match) {
        const score = parseFloat(match[1])
        return isNaN(score) ? undefined : (type === 'IELTS' ? score : Math.floor(score))
    }

    return undefined
}

function extractGPA(text: string): number | undefined {
    if (!text) return undefined

    // Extract GPA like "3.9", "4.0", "3.64/4.0"
    const match = text.match(/([\d.]+)/)
    if (match) {
        const gpa = parseFloat(match[1])
        return isNaN(gpa) || gpa > 5 ? undefined : gpa
    }

    return undefined
}

function extractEmail(text: string): string | undefined {
    if (!text) return undefined

    const match = text.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/)
    return match ? match[1] : undefined
}

function extractFirstUrl(text: string): string | undefined {
    if (!text) return undefined

    const match = text.match(/(https?:\/\/[^\s,]+)/)
    return match ? match[1].replace(/[)>\]]+$/, '') : undefined
}

function parsePercent(text: string): number | undefined {
    if (!text) return undefined

    const match = text.match(/([\d.]+)%/)
    if (match) {
        const val = parseFloat(match[1])
        return isNaN(val) ? undefined : val / 100
    }

    return undefined
}

function extractRatio(text: string): string | undefined {
    if (!text) return undefined

    // Extract ratios like "9:1", "18:1"
    const match = text.match(/(\d+:\d+)/)
    return match ? match[1] : undefined
}

function extractRankingNumber(text: string): number | undefined {
    if (!text) return undefined

    // Extract numbers like "#22", "#6", "22"
    const match = text.match(/#?(\d+)/)
    if (match) {
        const num = parseInt(match[1])
        return isNaN(num) ? undefined : num
    }

    return undefined
}

function extractCityState(location: string): { city: string; state?: string } {
    if (!location) return { city: '' }

    // Формат: "Город, Штат"  
    const parts = location.split(',').map(s => s.trim())
    if (parts.length >= 2) {
        // Convert Russian state names to 2-letter state codes
        const stateMap: Record<string, string> = {
            'Индиана': 'IN',
            'Виргиния': 'VA',
            'Массачусетс': 'MA',
            'Мэн': 'ME',
            'Миссури': 'MO',
            'Нью Йорк': 'NY',
            'Калифорния': 'CA',
            'Пенсильвания': 'PA',
            'штат Пенсильвания': 'PA',
            'Техас': 'TX',
            'Мэриленд': 'MD',
            'Иллинойс': 'IL',
            'Миннесота': 'MN',
            'Флорида': 'FL',
            'Огайо': 'OH',
            'Вашингтон Д.С.': 'DC',
            'Даллас': 'TX' // City  mapped to state
        }

        const state = stateMap[parts[1]] || undefined
        return { city: parts[0], state }
    }

    return { city: location }
}

async function importFromProperCSV() {
    try {
        console.log('📚 Starting proper CSV import with multiline support...\n')

        const csvPath = '/Users/daniel/Desktop/my/bilim_bridge/50_Universities_Offering_Full_Scholarships.xlsx - Sheet1.csv'
        const content = fs.readFileSync(csvPath, 'utf-8')

        console.log('Parsing CSV with proper quote handling...')
        const rows = parseCSV(content)

        console.log(`Parsed ${rows.length} total rows\n`)

        let imported = 0
        let skipped = 0
        let errors = 0

        // Skip header rows (row 0 is header, row 1 is color legend, row 2 is "DREAM UNIVERSITIES")
        for (let i = 3; i < rows.length; i++) {
            const row = rows[i]

            // Skip if not enough columns or empty row
            if (row.length < 5) continue

            const nameField = row[0]?.trim() || ''

            // Skip group headers and empty rows
            if (!nameField ||
                nameField.includes('DREAM UNIVERSITIES') ||
                nameField.includes('TARGET UNIVERSITIES') ||
                nameField.includes('SAFETY UNIVERSITIES') ||
                nameField.length < 3) {
                continue
            }

            try {
                const name = extractUniversityName(nameField)
                const location = extractCityState(row[4])

                // Skip if it's not a proper university name
                if (name.match(/^\d+%/) || name.match(/^https?:/) || name.includes('TOEFL') || name.includes('Common Application')) {
                    skipped++
                    continue
                }

                // CSV columns (0-indexed):
                // 0: Name+Location, 1: Description, 2: Scholarship type, 3: Ranking, 4: Location,
                // 5: Acceptance rate, 6: Major, 7: Deadlines, 8: Requirements
                // 9: TOEFL/IELTS, 10: SAT/ACT, 11: GPA, 12: Tuition, 13: Room&Board
                // 14: Need-based, 15: Merit-based, 16: % receiving aid, 17: Avg aid,
                // 18: Application fee, 19: Contacts, 20: Links

                const universityData = {
                    nameEn: name,
                    country: 'United States',
                    city: location.city,
                    usState: location.state as any,

                    // Acceptance rate
                    acceptanceRate: parseAcceptanceRate(row[5]),

                    // Financial
                    tuitionIntl: parseMoney(row[12]),
                    roomBoard: parseMoney(row[13]),

                    // Test requirements
                    minToefl: extractMinScore(row[9], 'TOEFL'),
                    minIelts: extractMinScore(row[9], 'IELTS'),
                    minSat: extractMinScore(row[10], 'SAT'),
                    minAct: extractMinScore(row[10], 'ACT'),
                    minGpa: extractGPA(row[11]),

                    // Scholarships
                    hasMeritScholarships: row[15]?.includes('Merit') || row[15]?.includes('merit') || row[2]?.includes('merit') || false,
                    meritDescription: row[15] || undefined,
                    hasNeedBased: row[14]?.includes('Need') || row[14]?.includes('need') || row[2]?.includes('need') || false,
                    needBasedDescription: row[14] || undefined,
                    needBasedIntl: row[14]?.length > 10 || false,

                    // Application info
                    acceptsCommonApp: row[8]?.includes('Common App') || false,
                    requiresCssProfile: row[8]?.includes('CSS') || false,

                    // Contact
                    admissionEmail: extractEmail(row[19]),
                    website: extractFirstUrl(row[20]),

                    // Statistics
                    finAidPercentage: parsePercent(row[16]),
                    studentFacultyRatio: extractRatio(row[7]),

                    // Ranking
                    usNewsRanking: extractRankingNumber(row[3]),

                    // Other requirements as text
                    otherRequirements: row[8] || undefined,
                }

                // Check if already exists
                const existing = await prisma.university.findFirst({
                    where: {
                        nameEn: universityData.nameEn,
                        country: universityData.country
                    }
                })

                if (existing) {
                    console.log(`  ⏭️  Skipped: ${universityData.nameEn} (already exists)`)
                    skipped++
                    continue
                }

                // Create university
                await prisma.university.create({
                    data: universityData
                })

                console.log(`  ✅ Imported: ${universityData.nameEn}`)
                imported++

            } catch (error) {
                console.error(`  ❌ Error on row ${i}: "${nameField.substring(0, 50)}..."`)
                console.error(`     ${error instanceof Error ? error.message : 'Unknown error'}`)
                errors++
            }
        }

        console.log(`\n✅ Import complete!`)
        console.log(`   Imported: ${imported}`)
        console.log(`   Skipped: ${skipped}`)
        console.log(`   Errors: ${errors}`)

    } catch (error) {
        console.error('❌ Fatal error:', error)
        throw error
    } finally {
        await prisma.$disconnect()
    }
}

importFromProperCSV()
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
