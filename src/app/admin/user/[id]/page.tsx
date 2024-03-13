import findUserById from '@/data-access/user/findUserById'
import { notFound } from 'next/navigation'
import UserDetail from './_components/UserDetail'

export default async function AdminUserDetailPage({
  params,
}: {
  params: { id: string }
}) {
  try {
    if (!params.id) notFound()
    const user = await findUserById(params.id)
    if (!user) {
      notFound()
    }

    return <UserDetail user={user} />
  } catch (_e) {
    notFound()
  }
}
