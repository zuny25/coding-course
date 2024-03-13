import { User } from '@/models/user/user'
import UserItem from './UserItem'

interface Props {
  users: User[]
}

export default function UserList({ users }: Props) {
  return (
    <ul>
      {users.map((user) => (
        <UserItem key={user.id} user={user} />
      ))}
    </ul>
  )
}
