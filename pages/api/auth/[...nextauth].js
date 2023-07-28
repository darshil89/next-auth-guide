import NextAuth from "next-auth/next";
// import { SessionProvider } from "next-auth/react";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyPassword } from "@/lip/auth";
import { connectToDatabase } from "@/lip/db";
export default NextAuth({
  session: {
    strategy: "jwt",
  },
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      authorize: async (credentials) => {
        const client = await connectToDatabase();

        const db = client.db();

        const existingUser = await db
          .collection("users")
          .findOne({ email: credentials.email });

        if (!existingUser) {
          client.close();
          throw new Error("No user found!");
        }

        const isValid = await verifyPassword(
          credentials.password,
          existingUser.password
        );

        if (!isValid) {
          client.close();
          throw new Error("password wrong!");
        }

        client.close();
        //if an obj is sent then it means that user has been authenticated
        return { email: existingUser.email };
      },
    }),
  ],
});
