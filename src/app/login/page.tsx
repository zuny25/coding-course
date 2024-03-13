import GoogleSignIn from '@/components/auth/GoogleSignIn'
import GithubSignIn from '@/components/auth/GithubSingnIn'
import LoginForm from './_components/LoginForm'

export default function RegisterPage() {
  return (
    <section>
      <LoginForm />
      <GoogleSignIn />
      <GithubSignIn />
    </section>
  )
}
