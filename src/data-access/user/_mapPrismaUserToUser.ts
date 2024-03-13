import { User as PUser } from '@prisma/client'
import { User } from '@/models/user/user'

export default function mapPrismaUserToUser(user: PUser): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email !== null ? user.email : '',
    role: user.role,
    createdAt: user.createdAt,
  }
}
