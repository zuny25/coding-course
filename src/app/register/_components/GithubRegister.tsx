'use client'

import { signIn } from 'next-auth/react'
import { useTransition } from 'react'

export default function GithubRegister() {
  const [pending, startTransition] = useTransition()

  const handleClick = () =>
    startTransition(async () => {
      await signIn('github', { callbackUrl: '/' })
    })
  return (
    <button type="button" onClick={handleClick} disabled={pending}>
      Github
    </button>
  )
}
