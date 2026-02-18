import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { authEndpoints } from '@/lib/api'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing credentials')
        }

        const res = await fetch(authEndpoints.login(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        })

        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data?.message ?? data?.error ?? 'Invalid credentials')
        }

        const data = await res.json().catch(() => null)
        if (!data) throw new Error('Invalid credentials')

        const user = data.user ?? data
        const id = user.id ?? user.sub
        const email = user.email
        const name =
          user.name ??
          ([user.firstName, user.lastName].filter(Boolean).join(' ') || email)

        if (!id || !email) {
          throw new Error('Invalid credentials')
        }

        return {
          id: String(id),
          email,
          name: name || undefined,
          role: (user as { role?: string }).role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role?: string }).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string; role?: string }).id = token.id as string
        (session.user as { id?: string; role?: string }).role = token.role as string
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Redirect to profile after login
      if (url === baseUrl) {
        return `${baseUrl}/profile`
      }
      // Allows relative callback URLs
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`
      }
      // Allows callback URLs on the same origin
      if (new URL(url).origin === baseUrl) {
        return url
      }
      return baseUrl
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}
