'use server'

import updateUser from '@/data-access/auth/updateUser'
import { ServerAction } from '@/models/server-action'
import {
  ResetPasswordUserInput,
  resetPasswordSchema,
} from '../_schema/reset-password-schema'

export default async function resetPassword(input: ResetPasswordUserInput) {
  const { id, password } = resetPasswordSchema.parse(input)
  const user = await updateUser({ id, password })
  return user
}

export const resetPasswordClient = ServerAction(resetPassword)
