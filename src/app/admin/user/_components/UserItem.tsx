import { User } from '@/models/user/user'
import { format } from 'date-fns/format'

import Link from 'next/link'

interface Props {
  user: User
}

export default function UserItem({ user }: Props) {
  return (
    <li>
      <Link href={`/admin/user/${user.id}`}>{user.name}</Link>
      <div>{user.email}</div>
      <div>{user.role}</div>
      <div>{format(user.createdAt, 'yyyy-MM-dd')}</div>
      <br />
    </li>
  )
}
