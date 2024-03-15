import { auth } from '@/auth'
import { Container } from '@chakra-ui/react'
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

  return (
    <Container maxW="100%" p={0}>
      {children}
    </Container>
  )
}
