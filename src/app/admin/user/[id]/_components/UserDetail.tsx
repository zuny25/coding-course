import { User } from '@/models/user/user'

interface Props {
  user: User
}

export default function AdminUserDetailPage({ user }: Props) {
  return <section>{user.name}</section>
}
