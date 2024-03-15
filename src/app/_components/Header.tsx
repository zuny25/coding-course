import { auth, signOut } from '@/auth'
import { Button, Flex, Link } from '@chakra-ui/react'

import NextLink from 'next/link'

export default async function Header() {
  const session = await auth()
  const user = session?.user

  const logoutAction = async () => {
    'use server'

    await signOut()
  }

  return (
    <Flex as="header" justifyContent="space-between" p={2} bg="gray.200">
      <section>CodingCourse</section>
      {!user && (
        <Flex gap={1}>
          <Link as={NextLink} href="/register">
            가입하기
          </Link>
          <Link as={NextLink} href="/login">
            로그인하기
          </Link>
        </Flex>
      )}
      {user && (
        <form action={logoutAction}>
          <Button type="submit" variant="link">
            로그아웃
          </Button>
        </form>
      )}
    </Flex>
  )
}
