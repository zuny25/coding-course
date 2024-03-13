import { AuthUser } from './auth-user'

export type UpdateUserInput = Required<Pick<AuthUser, 'id'>> &
  Partial<Pick<AuthUser, 'email' | 'name' | 'password'>>
