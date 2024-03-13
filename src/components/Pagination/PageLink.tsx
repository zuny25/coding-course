'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface Props {
  page: number
  disabled?: boolean
  children: React.ReactNode
}

export default function PageLink({ page, disabled, children }: Props) {
  const params = new URLSearchParams(useSearchParams())
  params.set('page', page.toString())

  if (disabled) {
    return <span>{children}</span>
  }

  return <Link href={{ search: params.toString() }}>{children}</Link>
}
