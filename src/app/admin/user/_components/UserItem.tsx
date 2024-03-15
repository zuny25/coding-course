import { User } from '@/models/user/user'
import { Link, Td, Tr } from '@chakra-ui/react'
import { format } from 'date-fns/format'

import NextLink from 'next/link'

interface Props {
  user: User
}

export default function UserItem({ user }: Props) {
  return (
    <Tr>
      <Td>
        <Link as={NextLink} href={`/admin/user/${user.id}`}>
          {user.name}
        </Link>
      </Td>

      <Td>{user.email}</Td>
      <Td>{user.role}</Td>
      <Td>{format(user.createdAt, 'yyyy-MM-dd')}</Td>
    </Tr>
  )
}
