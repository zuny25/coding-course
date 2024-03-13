import prismaClient from '@/lib/prismaClient'
import { User as PUser } from '@prisma/client'
import { AuthUser } from '@/models/auth/auth-user'

function mapPrismaUserToAuthUser(user: PUser): AuthUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email !== null ? user.email : '',
    password: user.password !== null ? user.password : undefined,
    role: user.role,
  }
}

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
