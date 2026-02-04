import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function deleteAllUniversities() {
    try {
        console.log('🗑️  Deleting all universities from database...\n')

        const result = await prisma.university.deleteMany({})

        console.log(`✅ Successfully deleted ${result.count} universities\n`)
        console.log('Database is now empty and ready for fresh import.')

    } catch (error) {
        console.error('❌ Error deleting universities:', error)
        throw error
    } finally {
        await prisma.$disconnect()
    }
}

deleteAllUniversities()
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
