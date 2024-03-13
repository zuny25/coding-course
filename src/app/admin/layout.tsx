import { auth } from '@/auth'
import { redirect } from 'next/navigation'

interface Props {
  children: React.ReactNode
}

export default async function AdminLayout({ children }: Props) {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  const user = session?.user

  if (user?.role !== 'admin') {
    redirect('/')
  }

  return <section>{children}</section>
}
