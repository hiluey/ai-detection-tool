import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: Record<string, string> | undefined) {
        if (!credentials) return null;

        // Simulação de usuário do banco de dados (substitua por busca real)
        const user = { id: "1", username: "admin", password: "$2a$10$u5H5N3Z8aJ/BGz8XW0kPzO9joI.CQ2pxJcXrF1N3G6dCmGn6eL2FS" }; // Senha: "admin123"

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) return null;

        return { id: user.id, name: user.username };
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string; 
      }
      return session;
    }
  }
  ,
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
