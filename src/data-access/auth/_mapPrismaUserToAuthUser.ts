import { User as PUser } from '@prisma/client'
import { AuthUser } from '@/models/auth/auth-user'

export default function mapPrismaUserToAuthUser(user: PUser): AuthUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email !== null ? user.email : '',
    password: user.password !== null ? user.password : undefined,
    role: user.role,
  }
}
