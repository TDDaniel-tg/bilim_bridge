import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanupInvalidUniversities() {
    try {
        console.log('🧹 Starting database cleanup...\n')

        // Get all universities
        const allUniversities = await prisma.university.findMany({
            select: {
                id: true,
                nameEn: true,
                country: true,
            }
        })

        console.log(`📊 Total universities in database: ${allUniversities.length}\n`)

        // Identify invalid records
        // Valid university names should be at least 5 characters and not contain % or start with numbers
        const invalid = allUniversities.filter(uni => {
            const name = uni.nameEn
            return (
                !name ||
                name.length < 5 ||
                name.includes('%') ||
                name.match(/^\d/) ||
                name.includes('http') ||
                name.includes('IELTS') ||
                name.includes('TOEFL') ||
                name.includes('SAT') ||
                name.includes('ACT') ||
                name.includes('Транскрипт') ||
                name.includes('Рекомендательн') ||
                name.includes('Документ') ||
                name.includes('Need-based') ||
                name.includes('Merit-based')
            )
        })

        console.log(`❌ Found ${invalid.length} invalid records\n`)

        if (invalid.length === 0) {
            console.log('✅ No invalid records found. Database is clean!')
            return
        }

        // Show sample of invalid records
        console.log('Sample of invalid records to be deleted:')
        invalid.slice(0, 10).forEach(uni => {
            console.log(`  - "${uni.nameEn}" (${uni.country})`)
        })
        console.log()

        // Delete invalid records
        console.log('🗑️  Deleting invalid records...\n')

        const deleteResult = await prisma.university.deleteMany({
            where: {
                id: {
                    in: invalid.map(u => u.id)
                }
            }
        })

        console.log(`✅ Cleanup complete!`)
        console.log(`   Deleted: ${deleteResult.count} invalid records`)
        console.log(`   Remaining: ${allUniversities.length - invalid.length} valid universities\n`)

    } catch (error) {
        console.error('❌ Error during cleanup:', error)
        throw error
    } finally {
        await prisma.$disconnect()
    }
}

// Run cleanup
cleanupInvalidUniversities()
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
