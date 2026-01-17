import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      checks: []
    }),
  ],callbacks: {
    async jwt({ token, account, user }) {
      if (account && account.provider === "google") {
        console.log(token)
        console.log(token.split("code")[1].split("&")[0])

        // Persist if needed
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
      }

      return token}
    },
  // This tells NextAuth to use our custom page instead of their default grey one
  pages: {
    signIn: "/login", 
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };