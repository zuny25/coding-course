import prismaClient from '@/lib/prismaClient'
import { User } from '@/models/user/user'
import mapPrismaUserToUser from './_mapPrismaUserToUser'

export default async function findUserById(
  id: string,
): Promise<User | undefined> {
  const user = await prismaClient.user.findUnique({
    where: {
      id,
    },
  })

  if (user === null) return undefined
  return mapPrismaUserToUser(user)
}
