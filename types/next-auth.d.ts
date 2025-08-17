// src/types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string; // or union: "user" | "admin"
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: string; // or "user" | "admin"
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: string; // or "user" | "admin"
  }
}
