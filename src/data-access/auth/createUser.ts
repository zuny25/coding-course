import { CreateUserInput } from '@/models/auth/create-user-input'
import prisma from '@/lib/prismaClient'
import { hash } from 'bcryptjs'
import { AuthUser } from '@/models/auth/auth-user'
import DataAccessError from '@/lib/serviceError'
import { Prisma } from '@prisma/client'
import mapPrismaUserToAuthUser from './_mapPrismaUserToAuthUser'

export default async function createUser({
  email,
  name,
  password,
}: CreateUserInput): Promise<Pick<AuthUser, 'name' | 'email'>> {
  try {
    const hashedPassword = await hash(password, 12)

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
      },
    })

    const mappedUser = mapPrismaUserToAuthUser(user)

    return {
      email: mappedUser.email,
      name: mappedUser.name,
    }
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        // Duplication
        throw new DataAccessError({
          name: 'DUPLICATION_ON_CREATE',
          message: '이미 사용중인 이메일 입니다.',
        })
      }
    }
    throw new Error('알수없는 에러입니다.')
  }
}
