'use server'

import findUserByEmail from '@/data-access/auth/findAuthUserByEmail'
import updateUserForgetPassword from '@/data-access/auth/updateUserForgetPassword'
import crypto from 'crypto'
import { ServerAction } from '@/models/server-action'
import {
  ForgetPasswordInput,
  forgetPasswordSchema,
} from '../_schema/forget-password.schema'

export default async function resetUserPassword(input: ForgetPasswordInput) {
  const { email } = forgetPasswordSchema.parse(input)

  const user = await findUserByEmail(email)

  if (user) {
    const resetToken = crypto.randomBytes(20).toString('hex')
    const passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex')

    const passwordResetExpires = Date.now() + 3600000 // 1h
    await updateUserForgetPassword({
      id: user.id,
      resetToken: passwordResetToken,
      expiry: new Date(passwordResetExpires),
    })

    const resetUrl = `${process.env.SERVER_URL}/reset-password/${resetToken}`
    console.log({ resetUrl })
  }
}

export const resetUserPasswordClient = ServerAction(resetUserPassword)
