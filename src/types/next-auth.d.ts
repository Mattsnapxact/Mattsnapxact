import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User extends DefaultUser {
    organizationId?: string | null;
    organizationName?: string | null;
    isAdmin?: boolean;
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      organizationId?: string | null;
      organizationName?: string | null;
      isAdmin?: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    organizationId?: string | null;
    organizationName?: string | null;
    isAdmin?: boolean;
  }
}
