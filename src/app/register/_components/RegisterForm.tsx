'use client'

/* eslint-disable react/jsx-props-no-spreading */
import useRegisterForm from '../_hooks/useRegisterForm'

export default function RegisterForm() {
  const { methods, submitting, onSubmitHandler } = useRegisterForm()

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = methods

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
      <div>
        <input {...register('name')} placeholder="이름" />
        {errors.name && <span> {errors.name?.message as string}</span>}
      </div>
      <div>
        <input {...register('email')} placeholder="이메일" />
        {errors.email && <span> {errors.email?.message as string}</span>}
      </div>
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
        {submitting ? '로딩...' : '가입하기'}
      </button>
    </form>
  )
}
