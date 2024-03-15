import GoogleSignIn from '@/components/auth/GoogleSignIn'
import GithubSignIn from '@/components/auth/GithubSingnIn'
import { Container } from '@chakra-ui/react'
import LoginForm from './_components/LoginForm'

export default function RegisterPage() {
  return (
    <Container>
      <LoginForm />
      <GoogleSignIn />
      <GithubSignIn />
    </Container>
  )
}
