import prismaClient from '@/lib/prismaClient'
import { AuthUser } from '@/models/auth/auth-user'
import mapPrismaUserToAuthUser from './_mapPrismaUserToAuthUser'

export default async function findUserUsingResetToken(
  token: string,
): Promise<AuthUser | undefined> {
  const user = await prismaClient.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: { gt: new Date(Date.now()) },
    },
  })

  if (user === null) return undefined

  return mapPrismaUserToAuthUser(user)
}
