// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from 'next-auth/next'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      image?: string
      role: string
    }
  }
}
