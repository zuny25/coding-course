import { Box, Container } from '@chakra-ui/react'
import { auth } from '@/auth'
import Header from './_components/Header'

export default async function Home() {
  const session = await auth()
  const user = session?.user
  console.log(user)
  return (
    <Container maxW="100%" p={0}>
      <Header />
      <Box pt={2}>Main</Box>
    </Container>
  )
}

export const dynamic = 'force-dynamic'
