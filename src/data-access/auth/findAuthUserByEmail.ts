import prismaClient from '@/lib/prismaClient'
import { AuthUser } from '@/models/auth/auth-user'
import mapPrismaUserToAuthUser from './_mapPrismaUserToAuthUser'

export default async function findUserByEmail(
  email: string,
): Promise<AuthUser | undefined> {
  const user = await prismaClient.user.findUnique({
    where: {
      email,
    },
  })

  if (user === null) return undefined

  return mapPrismaUserToAuthUser(user)
}
