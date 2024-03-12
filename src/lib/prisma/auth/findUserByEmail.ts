import prisma from '@/lib/prisma/prisma'

export default async function findUserByEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  })
  return user
}
