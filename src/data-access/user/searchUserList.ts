import prismaClient from '@/lib/prismaClient'
import { ListResponse } from '@/models/list-response'
import { SearchUserListInput } from '@/models/user/search-user-list-input'
import { User } from '@/models/user/user'
import mapPrismaUserToUser from './_mapPrismaUserToUser'

export default async function serchUserList(
  search: SearchUserListInput,
): Promise<ListResponse<User>> {
  const { page, size, email, name } = search

  const where = {
    AND: [
      { email: email !== undefined ? { contains: email } : undefined },
      { name: name !== undefined ? { contains: name } : undefined },
    ],
  }

  const [users, totalUsers] = await prismaClient.$transaction([
    prismaClient.user.findMany({ where, skip: (page - 1) * size, take: size }),
    prismaClient.user.count({ where }),
  ])

  return {
    currentPage: page,
    totalItems: totalUsers,
    totalPages: Math.ceil(totalUsers / size),
    items: users.map((user) => mapPrismaUserToUser(user)),
  }
}
