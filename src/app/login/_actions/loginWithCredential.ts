'use server'

import { signIn } from '@/auth'
import { revalidatePath } from 'next/cache'

export default async function loginWithCredential({
  email,
  password,
  callbackUrl,
}: {
  email: string
  password: string
  callbackUrl: string
}) {
  const res = await signIn('credentials', {
    redirect: false,
    email,
    password,
  })
  if (!res?.error) {
    revalidatePath(callbackUrl)
  }
  return res
}
