import { NextAuthConfig } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import prisma from '@/lib/prismaClient'

import findUserByEmail from '@/data-access/auth/findAuthUserByEmail'

const authConfig = {
  session: { strategy: 'jwt' },
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: '/login',
  },
  providers: [],
  callbacks: {
    async session({ session, token }) {
      const users = await findUserByEmail(session.user.email)
      return {
        ...session,
        user: {
          ...session.user,
          id: typeof token.id === 'string' ? token.id : undefined,
          role: users?.role,
        },
      }
    },
    jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
        }
      }
      return token
    },
  },
} satisfies NextAuthConfig

export default authConfig
