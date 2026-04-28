import NextAuth, { CredentialsSignin } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/src/lib/prisma";
import { authConfig } from "./auth.config";
import { loginLimiter, getIP, rateLimit } from "./lib/rate-limit";
import { verifyPassword } from "./lib/password";

class RateLimitError extends CredentialsSignin {
  code = "rate_limit"
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (token.id) session.user.id = token.id as string;
      return session;
    },
  },
  ...authConfig,
  providers: [
    ...authConfig.providers,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null;

        const ip = getIP(req)
        const key = `${ip}:${credentials.email as string}`
        const { limited } = await rateLimit(loginLimiter, key)
        if (limited) throw new RateLimitError()

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user?.password) return null;

        const isValid = await verifyPassword(
          credentials.password as string,
          user.password
        );

        return isValid ? user : null;
      },
    }),
  ],
});
