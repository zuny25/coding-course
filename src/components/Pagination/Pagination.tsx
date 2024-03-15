import { Center, HStack } from '@chakra-ui/react'
import { RxCaretLeft, RxCaretRight } from 'react-icons/rx'
import PageLink from './PageLink'

interface Props {
  currentPage: number
  totalPages: number
  totalItems: number
}

function getPaginationModifier(currentPage: number, totalPages: number) {
  if (totalPages <= 5 || currentPage <= 2) {
    return 1
  }
  if (currentPage + 2 > totalPages) {
    return totalPages - 4
  }
  return currentPage - 2
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
}: Props) {
  if (totalItems === 0) {
    return null
  }
  const modifier = getPaginationModifier(currentPage, totalPages)

  return (
    <Center>
      <HStack spacing={1}>
        <PageLink page={currentPage - 1} disabled={currentPage === 1}>
          <RxCaretLeft />
        </PageLink>

        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
          <PageLink key={i} page={modifier + i} currentPage={i + 1}>
            {modifier + i}
          </PageLink>
        ))}

        <PageLink page={currentPage + 1} disabled={currentPage === totalPages}>
          <RxCaretRight />
        </PageLink>
      </HStack>
    </Center>
  )
}
