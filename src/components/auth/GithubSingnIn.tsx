'use client'

import { Button } from '@chakra-ui/react'
import { signIn } from 'next-auth/react'
import { useTransition } from 'react'
import { FaGithub } from 'react-icons/fa'

export default function GithubSignIn() {
  const [pending, startTransition] = useTransition()

  const handleClick = () =>
    startTransition(async () => {
      await signIn('github', { callbackUrl: '/' })
    })
  return (
    <Button
      type="button"
      onClick={handleClick}
      isLoading={pending}
      variant="outline"
      leftIcon={<FaGithub />}
    >
      Github
    </Button>
  )
}
