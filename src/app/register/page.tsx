import GoogleSignIn from '@/components/auth/GoogleSignIn'
import GithubSignIn from '@/components/auth/GithubSingnIn'

import { Flex, Center, Box } from '@chakra-ui/react'

import RegisterForm from './_components/RegisterForm'

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
          <RegisterForm />
          <Flex gap={1} mt={4}>
            <GoogleSignIn />
            <GithubSignIn />
          </Flex>
        </Box>
      </Center>
    </Flex>
  )
}
