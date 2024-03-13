import { useTransition } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { useRouter } from 'next/navigation'
import {
  ForgetPasswordInput,
  forgetPasswordSchema,
} from '../_schema/forget-password.schema'
import resetUserPassword from '../_actions/resetUserPassword'

export default function useForgetPasswordForm() {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const methods = useForm<ForgetPasswordInput>({
    resolver: zodResolver(forgetPasswordSchema),
  })

  const onSubmitHandler: SubmitHandler<ForgetPasswordInput> = (values) => {
    startTransition(async () => {
      try {
        await resetUserPassword(values)
        router.push('/')
      } catch (e) {
        //
      }
    })
  }

  return {
    submitting: isPending,
    methods,
    onSubmitHandler,
  }
}
