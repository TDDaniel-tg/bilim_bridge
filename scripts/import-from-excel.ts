import { PrismaClient } from '@prisma/client'
import * as XLSX from 'xlsx'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

// Helper to extract numeric value from Korean currency format
function parseKoreanMoney(value: string): number | undefined {
    if (!value || typeof value !== 'string') return undefined

    // Extract first number from strings like "2000 - 4000 tuition + 1800"
    const match = value.match(/(\d+)/)
    if (!match) return undefined

    return parseInt(match[1])
}

// Helper to parse acceptance rate
function parseAcceptanceRate(rate: any): number | undefined {
    if (!rate) return undefined

    if (typeof rate === 'number') {
        return rate > 1 ? rate / 100 : rate
    }

    const cleaned = String(rate).replace('%', '').replace(',', '.').trim()
    const num = parseFloat(cleaned)

    if (isNaN(num)) return undefined

    return num > 1 ? num / 100 : num
}

// Helper to extract IELTS score
function extractIelts(text: string): number | undefined {
    if (!text) return undefined

    const match = String(text).match(/IELTS\s+([\d.]+)/i)
    if (match) {
        const score = parseFloat(match[1])
        return isNaN(score) ? undefined : score
    }

    return undefined
}

// Helper to extract TOEFL score  
function extractToefl(text: string): number | undefined {
    if (!text) return undefined

    const match = String(text).match(/TOEFL\s+(\d+)/i)
    if (match) {
        const score = parseInt(match[1])
        return isNaN(score) ? undefined : score
    }

    return undefined
}

// Helper to extract ranking
function extractRanking(text: any): number | undefined {
    if (!text) return undefined
    if (typeof text === 'number') return text

    const match = String(text).match(/(\d+)/)
    if (match) {
        const num = parseInt(match[1])
        return isNaN(num) || num > 2000 ? undefined : num
    }

    return undefined
}

async function importFromKorea(filePath: string) {
    console.log(`\n📚 Importing from South Korea file...\n`)

    const workbook = XLSX.readFile(filePath)
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const data: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

    let imported = 0
    let skipped = 0
    let errors = 0

    // Start from row 2 (skip headers)
    for (let i = 2; i < data.length; i++) {
        const row = data[i]

        if (!row || row.length < 5) continue

        const name = String(row[1] || '').trim()

        if (!name || name.length < 3) continue

        try {
            const universityData: any = {
                nameEn: name,
                country: 'South Korea',
                city: String(row[2] || 'Unknown').trim(),

                // Financial
                tuitionIntl: parseKoreanMoney(String(row[3] || '')),

                // Statistics
                acceptanceRate: parseAcceptanceRate(row[4]),

                // Test requirements from column 10 (TOEFL/IELTS)
                minToefl: extractToefl(String(row[10] || '')),
                minIelts: extractIelts(String(row[10] || '')),

                // Scholarships
                hasMeritScholarships: row[5] && String(row[5]).length > 5,
                meritDescription: row[5] ? String(row[5]) : undefined,

                // Rankings
                qsRanking: extractRanking(row[19]), // World ranking

                // Contact
                website: row[16] && String(row[16]).startsWith('http') ? String(row[16]) : undefined,
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

            await prisma.university.create({
                data: universityData
            })

            console.log(`  ✅ Imported: ${universityData.nameEn}`)
            imported++

        } catch (error) {
            console.error(`  ❌ Error on row ${i}: "${name.substring(0, 50)}..."`)
            console.error(`     ${error instanceof Error ? error.message : 'Unknown error'}`)
            errors++
        }
    }

    console.log(`\n✅ Import from South Korea complete!`)
    console.log(`   Imported: ${imported}`)
    console.log(`   Skipped: ${skipped}`)
    console.log(`   Errors: ${errors}\n`)

    return { imported, skipped, errors }
}

async function importFromChina(filePath: string) {
    console.log(`\n📚 Importing from China file...\n`)

    const workbook = XLSX.readFile(filePath)
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const data: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

    let imported = 0
    let skipped = 0
    let errors = 0

    // Start from row 1 (headers are in row 0)  
    for (let i = 1; i < data.length; i++) {
        const row = data[i]

        if (!row || row.length < 3) continue

        const name = String(row[0] || '').trim()

        if (!name || name.length < 3) continue

        try {
            const universityData: any = {
                nameEn: name,
                country: 'China',
                city: String(row[1] || 'Unknown').trim(),

                // Test requirements from column 6
                minIelts: extractIelts(String(row[6] || '')),
                minToefl: extractToefl(String(row[6] || '')),

                // Financial from column 9
                tuitionIntl: parseKoreanMoney(String(row[9] || '')),

                // Ranking from column 3 (QS)
                qsRanking: extractRanking(row[3]),

                // Contact
                website: row[8] && String(row[8]).startsWith('http') ? String(row[8]) : undefined,

                // Requirements from column 5
                otherRequirements: row[5] && String(row[5]).length > 10 ? String(row[5]) : undefined,

                // Scholarships - checking column 10
                hasMeritScholarships: row[10] && String(row[10]).toLowerCase().includes('scholarship'),
                meritDescription: row[10] && String(row[10]).length > 10 ? String(row[10]) : undefined,
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

            await prisma.university.create({
                data: universityData
            })

            console.log(`  ✅ Imported: ${universityData.nameEn}`)
            imported++

        } catch (error) {
            console.error(`  ❌ Error on row ${i}: "${name.substring(0, 50)}..."`)
            console.error(`     ${error instanceof Error ? error.message : 'Unknown error'}`)
            errors++
        }
    }

    console.log(`\n✅ Import from China complete!`)
    console.log(`   Imported: ${imported}`)
    console.log(`   Skipped: ${skipped}`)
    console.log(`   Errors: ${errors}\n`)

    return { imported, skipped, errors }
}

async function main() {
    try {
        let totalImported = 0
        let totalSkipped = 0
        let totalErrors = 0

        // Import China
        const chinaPath = '/Users/daniel/Desktop/my/bilim_bridge/Грант в Китае .xlsx'
        if (fs.existsSync(chinaPath)) {
            const result = await importFromChina(chinaPath)
            totalImported += result.imported
            totalSkipped += result.skipped
            totalErrors += result.errors
        } else {
            console.log(`⚠️  File not found: ${chinaPath}`)
        }

        // Import Korea
        const koreaPath = '/Users/daniel/Desktop/my/bilim_bridge/Южная Корея.xlsx'
        if (fs.existsSync(koreaPath)) {
            const result = await importFromKorea(koreaPath)
            totalImported += result.imported
            totalSkipped += result.skipped
            totalErrors += result.errors
        } else {
            console.log(`⚠️  File not found: ${koreaPath}`)
        }

        console.log(`\n🎉 TOTAL RESULTS:`)
        console.log(`   Total Imported: ${totalImported}`)
        console.log(`   Total Skipped: ${totalSkipped}`)
        console.log(`   Total Errors: ${totalErrors}\n`)

    } catch (error) {
        console.error('❌ Fatal error:', error)
        throw error
    } finally {
        await prisma.$disconnect()
    }
}

main()
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
