import prismaClient from '@/lib/prismaClient'

export default async function updateUserForgetPassword({
  id,
  resetToken,
  expiry,
}: {
  id: string
  resetToken: string | null
  expiry: Date | null
}) {
  //
  await prismaClient.user.update({
    where: { id },
    data: {
      resetToken,
      resetTokenExpiry: expiry,
    },
  })
}
