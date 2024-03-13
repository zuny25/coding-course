'use client'

/* eslint-disable react/jsx-props-no-spreading */
import { AuthUser } from '@/models/auth/auth-user'
import useResetPasswordForm from '../_hooks/useResetPasswordForm'

interface Props {
  user: AuthUser
}

export default function ResetPasswordForm({ user }: Props) {
  const { methods, submitting, onSubmitHandler } = useResetPasswordForm(user.id)

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = methods

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
      <div>
        <input type="password" {...register('password')} placeholder="암호" />
        {errors.password && <span> {errors.password?.message as string}</span>}
      </div>
      <div>
        <input
          type="password"
          {...register('passwordConfirm')}
          placeholder="암호 확인"
        />
        {errors.passwordConfirm && (
          <span> {errors.passwordConfirm?.message as string}</span>
        )}
      </div>
      <button type="submit" disabled={submitting}>
        {submitting ? '로딩...' : '암호 변경하기'}
      </button>
    </form>
  )
}
