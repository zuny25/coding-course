import { PrismaClient } from '@prisma/client'

function prismaSingleton() {
  if (process.env.NODE_ENV === 'production') {
    return new PrismaClient()
  }
  const globalWithPrismaClient = global as typeof globalThis & {
    prisma: PrismaClient
  }
  if (!globalWithPrismaClient.prisma) {
    globalWithPrismaClient.prisma = new PrismaClient()
  }
  return globalWithPrismaClient.prisma
}

export default prismaSingleton()
