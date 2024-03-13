import prismaClient from '@/lib/prismaClient'
import DataAccessError from '@/lib/serviceError'
import { AuthUser } from '@/models/auth/auth-user'
import { UpdateUserInput } from '@/models/auth/update-user-input'
import { Prisma } from '@prisma/client'
import { hash } from 'bcryptjs'
import mapPrismaUserToAuthUser from './_mapPrismaUserToAuthUser'

export default async function updateUser({
  id,
  email,
  name,
  password,
}: UpdateUserInput): Promise<Pick<AuthUser, 'name' | 'email'>> {
  try {
    const hashedPassword =
      password !== undefined ? await hash(password, 12) : undefined

    const user = await prismaClient.user.update({
      where: { id },
      data: {
        email,
        name,
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    })

    const mappedUser = mapPrismaUserToAuthUser(user)

    return {
      email: mappedUser.email,
      name: mappedUser.name,
    }
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      throw new DataAccessError({ name: 'ERROR_ON_UPDATE', message: e.message })
    }
    throw new Error('알수없는 에러입니다.')
  }
}
