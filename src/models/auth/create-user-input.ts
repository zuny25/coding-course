import { AuthUser } from './auth-user'

export type CreateUserInput = Required<
  Pick<AuthUser, 'name' | 'email' | 'password'>
>
