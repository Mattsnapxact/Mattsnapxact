import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Dynamic import so Prisma doesn't connect during build
          const { prisma } = await import("./prisma");

          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            include: { organization: { select: { name: true } } },
          });

          if (!user) {
            return null;
          }

          if (!user.isActive) {
            return null;
          }

          const isValid = await compare(credentials.password, user.password);

          if (!isValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            organizationId: user.organizationId,
            organizationName: user.organization?.name || null,
            isAdmin: user.isAdmin,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.organizationId = user.organizationId;
        token.organizationName = user.organizationName;
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as { id: string }).id = token.sub!;
        session.user.organizationId = token.organizationId;
        session.user.organizationName = token.organizationName;
        session.user.isAdmin = token.isAdmin;
      }
      return session;
    },
  },
};
