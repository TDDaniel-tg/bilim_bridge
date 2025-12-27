import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: 'admin@bilimbridge.com',
      role: 'ADMIN',
    },
  })

  console.log('Created admin user')

  // Create sample universities
  const universities = [
    {
      nameEn: 'Massachusetts Institute of Technology',
      nameRu: 'Массачусетский технологический институт',
      motto: 'Mens et Manus',
      country: 'United States',
      city: 'Cambridge',
      address: '77 Massachusetts Ave, Cambridge, MA 02139',
      latitude: 42.3601,
      longitude: -71.0942,
      logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/MIT_logo.svg',
      website: 'https://www.mit.edu',
      admissionPage: 'https://mitadmissions.org',
      admissionEmail: 'admissions@mit.edu',
      minGpa: 3.7,
      avgGpa: 3.95,
      minSat: 1400,
      avgSat25: 1520,
      avgSat75: 1580,
      minIelts: 7.0,
      minToefl: 90,
      tuitionIntl: 57986,
      roomBoard: 18730,
      otherFees: 2500,
      totalCost: 79216,
      acceptanceRate: 3.2,
      qsRanking: 1,
      usNewsRanking: 2,
      totalStudents: 11934,
      intlStudents: 3400,
      hasBachelor: true,
      hasMaster: true,
      hasPhd: true,
      hasFullRide: true,
      hasMeritScholarships: true,
      hasNeedBased: true,
      acceptsCommonApp: true,
      regularDeadline: new Date('2025-01-01'),
      earlyActionDate: new Date('2024-11-01'),
      majors: [
        { name: 'Computer Science', description: 'Top-ranked CS program', link: 'https://www.eecs.mit.edu' },
        { name: 'Engineering', description: 'World-class engineering programs', link: 'https://engineering.mit.edu' },
        { name: 'Mathematics', description: 'Leading mathematics department', link: 'https://math.mit.edu' },
      ],
    },
    {
      nameEn: 'Stanford University',
      nameRu: 'Стэнфордский университет',
      motto: 'Die Luft der Freiheit weht',
      country: 'United States',
      city: 'Stanford',
      address: '450 Serra Mall, Stanford, CA 94305',
      latitude: 37.4275,
      longitude: -122.1697,
      logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Seal_of_Stanford_University.svg',
      website: 'https://www.stanford.edu',
      admissionPage: 'https://admission.stanford.edu',
      admissionEmail: 'admission@stanford.edu',
      minGpa: 3.7,
      avgGpa: 3.96,
      minSat: 1380,
      avgSat25: 1470,
      avgSat75: 1570,
      minIelts: 7.0,
      minToefl: 100,
      tuitionIntl: 56169,
      roomBoard: 17860,
      otherFees: 2200,
      totalCost: 76229,
      acceptanceRate: 3.7,
      qsRanking: 5,
      usNewsRanking: 3,
      totalStudents: 17246,
      intlStudents: 4200,
      hasBachelor: true,
      hasMaster: true,
      hasPhd: true,
      hasFullRide: true,
      hasMeritScholarships: true,
      hasNeedBased: true,
      acceptsCommonApp: true,
      regularDeadline: new Date('2025-01-05'),
      earlyActionDate: new Date('2024-11-01'),
      edDeadline: new Date('2025-01-02'),
      majors: [
        { name: 'Computer Science', description: 'Silicon Valley\'s top CS program', link: 'https://cs.stanford.edu' },
        { name: 'Business', description: 'Stanford GSB undergraduate program', link: 'https://www.gsb.stanford.edu' },
        { name: 'Engineering', description: 'Innovative engineering education', link: 'https://engineering.stanford.edu' },
      ],
    },
    {
      nameEn: 'Harvard University',
      nameRu: 'Гарвардский университет',
      motto: 'Veritas',
      country: 'United States',
      city: 'Cambridge',
      address: 'Massachusetts Hall, Cambridge, MA 02138',
      latitude: 42.3770,
      longitude: -71.1167,
      logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Harvard_University_coat_of_arms.svg',
      website: 'https://www.harvard.edu',
      admissionPage: 'https://college.harvard.edu/admissions',
      admissionEmail: 'college@fas.harvard.edu',
      minGpa: 3.8,
      avgGpa: 3.98,
      minSat: 1400,
      avgSat25: 1480,
      avgSat75: 1580,
      minIelts: 7.0,
      minToefl: 100,
      tuitionIntl: 54269,
      roomBoard: 20374,
      otherFees: 2500,
      totalCost: 77143,
      acceptanceRate: 3.4,
      qsRanking: 4,
      usNewsRanking: 3,
      totalStudents: 21613,
      intlStudents: 5100,
      hasBachelor: true,
      hasMaster: true,
      hasPhd: true,
      hasFullRide: true,
      hasMeritScholarships: false,
      hasNeedBased: true,
      acceptsCommonApp: true,
      regularDeadline: new Date('2025-01-01'),
      earlyActionDate: new Date('2024-11-01'),
      majors: [
        { name: 'Economics', description: 'Leading economics program', link: 'https://economics.harvard.edu' },
        { name: 'Government', description: 'Top political science department', link: 'https://gov.harvard.edu' },
        { name: 'Computer Science', description: 'Strong CS curriculum', link: 'https://seas.harvard.edu/computer-science' },
      ],
    },
    {
      nameEn: 'University of Oxford',
      nameRu: 'Оксфордский университет',
      motto: 'Dominus illuminatio mea',
      country: 'United Kingdom',
      city: 'Oxford',
      address: 'Wellington Square, Oxford OX1 2JD',
      latitude: 51.7548,
      longitude: -1.2544,
      logo: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Oxford-University-Circlet.svg',
      website: 'https://www.ox.ac.uk',
      admissionPage: 'https://www.ox.ac.uk/admissions',
      admissionEmail: 'undergraduate.admissions@admin.ox.ac.uk',
      minGpa: 3.7,
      avgGpa: 3.9,
      minIelts: 7.0,
      minToefl: 100,
      tuitionIntl: 39010,
      roomBoard: 15000,
      otherFees: 2000,
      totalCost: 56010,
      acceptanceRate: 17.5,
      qsRanking: 3,
      totalStudents: 24299,
      intlStudents: 8500,
      hasBachelor: true,
      hasMaster: true,
      hasPhd: true,
      hasFullRide: false,
      hasMeritScholarships: true,
      hasNeedBased: true,
      regularDeadline: new Date('2024-10-15'),
      majors: [
        { name: 'Philosophy, Politics and Economics', description: 'Famous PPE program', link: 'https://www.ox.ac.uk/ppe' },
        { name: 'Law', description: 'World-renowned law program', link: 'https://www.law.ox.ac.uk' },
        { name: 'Medicine', description: 'Prestigious medical school', link: 'https://www.medsci.ox.ac.uk' },
      ],
    },
    {
      nameEn: 'University of Cambridge',
      nameRu: 'Кембриджский университет',
      motto: 'Hinc lucem et pocula sacra',
      country: 'United Kingdom',
      city: 'Cambridge',
      address: 'The Old Schools, Trinity Ln, Cambridge CB2 1TN',
      latitude: 52.2043,
      longitude: 0.1218,
      logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/University_of_Cambridge.svg',
      website: 'https://www.cam.ac.uk',
      admissionPage: 'https://www.undergraduate.study.cam.ac.uk',
      admissionEmail: 'admissions@cam.ac.uk',
      minGpa: 3.7,
      avgGpa: 3.9,
      minIelts: 7.5,
      minToefl: 110,
      tuitionIntl: 35000,
      roomBoard: 12000,
      otherFees: 2000,
      totalCost: 49000,
      acceptanceRate: 21.0,
      qsRanking: 2,
      totalStudents: 23247,
      intlStudents: 7800,
      hasBachelor: true,
      hasMaster: true,
      hasPhd: true,
      hasFullRide: false,
      hasMeritScholarships: true,
      hasNeedBased: true,
      regularDeadline: new Date('2024-10-15'),
      majors: [
        { name: 'Mathematics', description: 'World-leading mathematics program', link: 'https://www.maths.cam.ac.uk' },
        { name: 'Natural Sciences', description: 'Comprehensive science education', link: 'https://www.natsci.tripos.cam.ac.uk' },
        { name: 'Engineering', description: 'Innovative engineering curriculum', link: 'https://www.eng.cam.ac.uk' },
      ],
    },
  ]

  for (const uni of universities) {
    await prisma.university.create({ data: uni })
    console.log(`Created university: ${uni.nameEn}`)
  }

  // Create sample guides
  const guides = [
    {
      title: 'How to Apply Through Common App',
      slug: 'how-to-apply-common-app',
      category: 'Application Process',
      excerpt: 'Step-by-step guide to navigating the Common Application',
      content: `
# How to Apply Through Common App

The Common Application is used by over 900 colleges and universities. Here's how to get started:

## Step 1: Create Your Account
Visit commonapp.org and create your account...

## Step 2: Fill Out Your Profile
Complete all sections of your profile including personal information, family details, and education history...

## Step 3: Activities Section
List your extracurricular activities, work experience, and awards...

## Step 4: Write Your Essay
The Common App essay is your chance to share your story. Choose from 7 prompts...

## Step 5: Submit to Universities
Add universities to your list and complete any supplemental essays required...
      `,
      tags: ['common-app', 'application', 'how-to'],
      isPublished: true,
    },
    {
      title: 'Understanding CSS Profile for Financial Aid',
      slug: 'understanding-css-profile',
      category: 'Financial Aid',
      excerpt: 'Everything you need to know about the CSS Profile',
      content: `
# Understanding CSS Profile

The CSS Profile is required by many private universities to determine your eligibility for institutional financial aid...

## What is CSS Profile?
The College Scholarship Service (CSS) Profile is...

## Who Needs to Submit?
Check if your universities require the CSS Profile...

## Required Documents
- Tax returns
- W-2 forms
- Asset information
...
      `,
      tags: ['css-profile', 'financial-aid', 'scholarships'],
      isPublished: true,
    },
  ]

  for (const guide of guides) {
    await prisma.guide.create({ data: guide })
    console.log(`Created guide: ${guide.title}`)
  }

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error in seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

