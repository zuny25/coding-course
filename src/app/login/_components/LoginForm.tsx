'use client'

/* eslint-disable react/jsx-props-no-spreading */
import { useSearchParams } from 'next/navigation'
import useLoginForm from '../_hooks/useLoginForm'

export default function LoginForm() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  const { methods, submitting, onSubmitHandler } = useLoginForm(callbackUrl)

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = methods

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
      <div>
        <input {...register('email')} placeholder="이메일" />
        {errors.email && <span> {errors.email?.message as string}</span>}
      </div>
      <div>
        <input type="password" {...register('password')} placeholder="암호" />
        {errors.password && <span> {errors.password?.message as string}</span>}
      </div>
      {errors.root && <span> {errors.root?.message as string}</span>}
      <button type="submit" disabled={submitting}>
        {submitting ? '로딩...' : '로그인'}
      </button>
    </form>
  )
}
