import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'

import {
  isServerActionError,
  isServerActionSuccess,
} from '@/models/server-action'
import { signIn } from 'next-auth/react'
import { isDataAccessError } from '@/lib/serviceError'

import { useTransition } from 'react'
import {
  RegisterUserInput,
  registerUserSchema,
} from '../_schema/register-user-schema'

import { registerUserActionClient } from '../_actions/registerUser'

export default function useRegisterForm() {
  const [isPending, startTransition] = useTransition()
  const methods = useForm<RegisterUserInput>({
    resolver: zodResolver(registerUserSchema),
  })

  const onSubmitHandler: SubmitHandler<RegisterUserInput> = (values) => {
    startTransition(async () => {
      const res = await registerUserActionClient(values)
      if (isServerActionSuccess(res)) {
        signIn(undefined, { callbackUrl: '/' })
      }
      if (isServerActionError(res)) {
        const { error } = res

        if (
          isDataAccessError(error) &&
          error.name === 'DUPLICATION_ON_CREATE'
        ) {
          methods.setError('email', error)
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
