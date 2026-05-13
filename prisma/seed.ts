import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const branches = [
    { name: 'Abasto Fix', code: 'FX01' },
    { name: 'Swop Tech', code: 'SWP13' },
    { name: 'Abasto 2', code: 'IC01' },
    { name: 'Abasto 1', code: 'IC02' },
  ]

  for (const branch of branches) {
    await prisma.branch.upsert({
      where: { code: branch.code },
      update: { name: branch.name },
      create: branch,
    })
  }

  console.log('Seed completed: 4 branches created/verified.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
