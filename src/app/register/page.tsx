import GoogleSignIn from '@/components/auth/GoogleSignIn'
import GithubSignIn from '@/components/auth/GithubSingnIn'

import RegisterForm from './_components/RegisterForm'

export default function RegisterPage() {
  return (
    <section>
      <RegisterForm />
      <GoogleSignIn />
      <GithubSignIn />
    </section>
  )
}
