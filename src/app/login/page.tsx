import GoogleSignIn from '@/components/auth/GoogleSignIn'
import GithubSignIn from '@/components/auth/GithubSingnIn'
import { Box, Center, Flex } from '@chakra-ui/react'
import LoginForm from './_components/LoginForm'

export default function RegisterPage() {
  return (
    <Flex
      width="100vw"
      height="100vh"
      alignContent="center"
      justifyContent="center"
    >
      <Center>
        <Box mb={2}>
          <LoginForm />
          <Flex gap={1} mt={4}>
            <GoogleSignIn />
            <GithubSignIn />
          </Flex>
        </Box>
      </Center>
    </Flex>
  )
}
