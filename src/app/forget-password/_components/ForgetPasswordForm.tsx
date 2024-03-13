'use client'

/* eslint-disable react/jsx-props-no-spreading */
import useForgetPasswordForm from '../_hooks/useForgetPasswordForm'

export default function ForgetPasswordFom() {
  const { methods, submitting, onSubmitHandler } = useForgetPasswordForm()

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

      {errors.root && <span> {errors.root?.message as string}</span>}
      <button type="submit" disabled={submitting}>
        {submitting ? '로딩...' : '이메일 보내기'}
      </button>
    </form>
  )
}
