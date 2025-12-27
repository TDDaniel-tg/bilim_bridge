// NextAuth.js v5 configuration placeholder
// This file provides the structure for authentication
// Users need to obtain OAuth credentials and configure properly

/*
To complete authentication setup:

1. Install NextAuth.js v5 beta:
   npm install next-auth@beta

2. Get OAuth Credentials:
   
   Google OAuth:
   - Go to https://console.cloud.google.com/
   - Create project
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: http://localhost:3000/api/auth/callback/google
   - Copy Client ID and Secret to .env
   
   Facebook OAuth:
   - Go to https://developers.facebook.com/
   - Create app
   - Add Facebook Login product
   - Get App ID and App Secret
   - Add redirect URI: http://localhost:3000/api/auth/callback/facebook

3. Update .env:
   NEXTAUTH_SECRET="generate-random-secret-here"
   NEXTAUTH_URL="http://localhost:3000"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   FACEBOOK_CLIENT_ID="your-facebook-client-id"
   FACEBOOK_CLIENT_SECRET="your-facebook-client-secret"

4. Create app/api/auth/[...nextauth]/route.ts:

import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials")
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.password) {
          throw new Error("Invalid credentials")
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isCorrectPassword) {
          throw new Error("Invalid credentials")
        }

        return user
      }
    })
  ],
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

5. Create middleware.ts for protected routes:

import { withAuth } from "next-auth/middleware"

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      if (req.nextUrl.pathname.startsWith('/dashboard')) {
        return !!token
      }
      if (req.nextUrl.pathname.startsWith('/admin')) {
        return token?.role === 'ADMIN'
      }
      return true
    },
  },
})

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*']
}

6. Update login/register pages to use NextAuth:

import { signIn } from "next-auth/react"

const handleLogin = async (email: string, password: string) => {
  const result = await signIn("credentials", {
    email,
    password,
    redirect: true,
    callbackUrl: "/dashboard"
  })
}

7. Create API route for registration:

// app/api/auth/register/route.ts
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    
    const hashedPassword = await bcrypt.hash(password, 12)
    
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: "STUDENT"
      }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    )
  }
}

8. Use authentication in components:

"use client"
import { useSession, signOut } from "next-auth/react"

export default function Component() {
  const { data: session, status } = useSession()
  
  if (status === "loading") return <div>Loading...</div>
  if (!session) return <div>Not authenticated</div>
  
  return (
    <div>
      <p>Welcome {session.user.email}</p>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  )
}

*/

export const AUTH_CONFIG_READY = false

export const authInstructions = `
Authentication is ready to be configured!

Follow these steps:
1. Get OAuth credentials (Google, Facebook)
2. Install: npm install next-auth@beta
3. Create: app/api/auth/[...nextauth]/route.ts
4. Create: middleware.ts
5. Update: .env with credentials

See comments in lib/auth.ts for complete code examples.
`

