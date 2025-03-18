import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

// Garantindo que as variáveis de ambiente não sejam undefined
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("As variáveis de ambiente do Supabase não estão configuradas corretamente.");
  throw new Error("As variáveis de ambiente do Supabase não estão configuradas corretamente.");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "seu@email.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Credenciais não fornecidas.");
        }

        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

        if (error || !data.user) {
          throw new Error("Usuário ou senha inválidos.");
        }

        return {
          id: data.user.id,
          name: data.user.email,
          email: data.user.email,
        };
      },
    }),
  ],
  pages: {
    signIn: "/detect/login", // Página personalizada de login
  },
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
