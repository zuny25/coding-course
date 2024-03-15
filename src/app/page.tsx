import { Box, Container } from '@chakra-ui/react'
import Header from './_components/Header'

export default function Home() {
  return (
    <Container maxW="100%" p={0}>
      <Header />
      <Box pt={2}>Main</Box>
    </Container>
  )
}
