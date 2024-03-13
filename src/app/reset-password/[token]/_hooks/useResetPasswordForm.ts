import {
  isServerActionError,
  isServerActionSuccess,
} from '@/models/server-action'
import { isDataAccessError } from '@/lib/serviceError'

import { useTransition } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'

import { resetPasswordClient } from '../_actions/resetPassword'
import {
  ResetPasswordUserInput,
  resetPasswordSchema,
} from '../_schema/reset-password-schema'

export default function useRegisterForm(id: string) {
  const [isPending, startTransition] = useTransition()
  const methods = useForm<ResetPasswordUserInput>({
    resolver: zodResolver(resetPasswordSchema),
  })
  methods.setValue('id', id)

  const onSubmitHandler: SubmitHandler<ResetPasswordUserInput> = (values) => {
    startTransition(async () => {
      const res = await resetPasswordClient(values)
      if (isServerActionSuccess(res)) {
        signIn(undefined, { callbackUrl: '/' })
      }
      if (isServerActionError(res)) {
        const { error } = res

        if (isDataAccessError(error)) {
          methods.setError('root', error)
        }
      }
    })
  }

  return {
    submitting: isPending,
    methods,
    onSubmitHandler,
  }
}
