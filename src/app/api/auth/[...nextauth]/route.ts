import { runMigrations } from '@/lib/migrate';
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

let migrationRun = false;

if (!migrationRun && process.env.NODE_ENV === 'production') {
  runMigrations().then(() => {
    migrationRun = true;
  }).catch(console.error);
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
