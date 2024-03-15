'use client'

import { FaGoogle } from 'react-icons/fa'

import { Button } from '@chakra-ui/react'
import { signIn } from 'next-auth/react'
import { useTransition } from 'react'

export default function GoogleSignIn() {
  const [pending, startTransition] = useTransition()

  const handleClick = () =>
    startTransition(async () => {
      await signIn('google', { callbackUrl: '/' })
    })
  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleClick}
      isLoading={pending}
      leftIcon={<FaGoogle />}
    >
      Google
    </Button>
  )
}
