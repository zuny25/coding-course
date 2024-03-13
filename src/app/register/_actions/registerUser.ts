'use server'

import createUser from '@/data-access/auth/createUser'
import { ServerAction } from '@/models/server-action'

import {
  RegisterUserInput,
  registerUserSchema,
} from './schema/register-user-schema'

export default async function registerUserAction(input: RegisterUserInput) {
  const { name, email, password } = registerUserSchema.parse(input)
  const user = await createUser({ name, email, password })
  return user
}

export const registerUserActionClient = ServerAction(registerUserAction)
