import findUserUsingResetToken from '@/data-access/auth/findUserUsingResetToken'
import { notFound } from 'next/navigation'
import crypto from 'crypto'
import ResetPasswordForm from './_components/ResetPasswordForm'

export default async function ResetPasswordPage({
  params,
}: {
  params: { token: string }
}) {
  try {
    if (!params.token) notFound()
    const hashedToken = crypto
      .createHash('sha256')
      .update(params.token)
      .digest('hex')

    const user = await findUserUsingResetToken(hashedToken)

    if (!user) {
      return <section>잘못된 토큰이거나 만료되었습니다.</section>
    }
    return (
      <section>
        <ResetPasswordForm user={user} />
      </section>
    )
  } catch (e) {
    notFound()
  }
}
