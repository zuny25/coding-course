'use client'

import { signIn } from 'next-auth/react'
import { useTransition } from 'react'

export default function GoogleRegister() {
  const [pending, startTransition] = useTransition()

  const handleClick = () =>
    startTransition(async () => {
      await signIn('google', { callbackUrl: '/' })
    })
  return (
    <button type="button" onClick={handleClick} disabled={pending}>
      Google
    </button>
  )
}
