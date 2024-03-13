import GithubRegister from './_components/GithubRegister'
import GoogleRegister from './_components/GoogleRegister'
import RegisterForm from './_components/RegisterForm'

export default function RegisterPage() {
  return (
    <section>
      <RegisterForm />
      <GoogleRegister />
      <GithubRegister />
    </section>
  )
}
