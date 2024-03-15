'use client'

import { Button } from '@chakra-ui/react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface Props {
  page: number
  currentPage?: number
  disabled?: boolean
  children: React.ReactNode
}

export default function PageLink({
  page,
  disabled,
  children,
  currentPage = 0,
}: Props) {
  const params = new URLSearchParams(useSearchParams())
  params.set('page', page.toString())

  const activePage = currentPage === page

  if (disabled) {
    return <Button disabled>{children}</Button>
  }

  return (
    <Button
      colorScheme={activePage ? 'blue' : 'gray'}
      as={Link}
      href={{ search: params.toString() }}
    >
      {children}
    </Button>
  )
}
