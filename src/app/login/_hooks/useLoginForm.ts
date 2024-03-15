import { useTransition } from 'react'

import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'


import { useRouter } from 'next/navigation'
import { LoginUserInput, loginUserSchema } from '../_schema/login-user-schema'
import loginWithCredential from '../_actions/loginWithCredential'

export default function useLoginForm(callbackUrl: string) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const methods = useForm<LoginUserInput>({
    resolver: zodResolver(loginUserSchema),
  })

  const onSubmitHandler: SubmitHandler<LoginUserInput> = (values) => {
    startTransition(async () => {
      try {
        const res = await loginWithCredential({
          email: values.email,
          password: values.password,
          callbackUrl,
        })
        if (!res?.error) {
          router.push(callbackUrl)
        } else {
          methods.reset({ password: '' })
          const message = '이메일이나 암호가 잘못되었습니다.'

          methods.setError('root', { message })
        }
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
