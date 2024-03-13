import { auth, signOut } from '@/auth'
import Link from 'next/link'

export default async function Header() {
  const session = await auth()
  const user = session?.user

  const logoutAction = async () => {
    'use server'

    await signOut()
  }
  console.log(user)

  return (
    <header>
      <section>CodingCourse</section>
      {!user && (
        <>
          <Link href="/register">가입하기</Link>
          <Link href="/login">로그인하기</Link>
        </>
      )}
      {user && (
        <form action={logoutAction}>
          <button type="submit">Lougout</button>
        </form>
      )}
    </header>
  )
}
