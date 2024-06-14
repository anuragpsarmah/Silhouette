import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        identifier: { label: "Username/Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });

          if (!user) {
            throw new Error("Incorrect username or email.");
          }

          if (user.isVerified) {
            const isPasswordValid = await bcrypt.compare(
              credentials.password,
              user.password
            );
            if (isPasswordValid) {
              return user;
            } else {
              throw new Error("Incorrect password.");
            }
          } else {
            const expiryDate = new Date();
            const sixDigitCode = Math.floor(
              100000 + Math.random() * 900000
            ).toString();
            expiryDate.setHours(expiryDate.getHours() + 1);

            user.verificationCode = sixDigitCode;
            user.verificationCodeExpiry = expiryDate;

            await user.save();

            const emailResponse = await sendVerificationEmail(
              user.email,
              user.username,
              sixDigitCode
            );

            if(!emailResponse.success) {
              throw new Error("Signup again to verify your email.");
            }

            throw new Error("Verify your email first.");
          }
        } catch (err: any) {
          console.log(err);
          throw new Error(
            err.message ||
              "An error occurred while signing in. Please try again later."
          );
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessage = user.isAcceptingMessage;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessage = token.isAcceptingMessage;
        session.user.username = token.username;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.JWT_SECRET,
};
