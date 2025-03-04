import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import prisma from '@/libs/prisma';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { Account, User } from '@prisma/client';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: 'Credentials',
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        const user = await prisma.user.findFirst({
          where: {
            email: credentials?.email,
            password: credentials?.password,
          },
        });

        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return user as any;
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      profile(profile) {
        return {
          id: profile.sub,
          email: profile.email,
          firstName: profile.given_name || profile.name.split(' ')[0],
          lastName:
            profile.family_name ||
            profile.name.split(' ').slice(1).join(' ') ||
            '',
          image: profile.picture,
          admin: false,
        };
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email || '' },
          include: { Account: true },
        });

        if (existingUser) {
          // If user exists but doesn't have a Google account linked
          if (
            !existingUser.Account.some(
              (acc: Account) => acc.provider === 'google'
            )
          ) {
            // Link the Google account
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                type: account.type || 'oauth',
                provider: account.provider,
                providerAccountId: account.providerAccountId || '',
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                session_state: account.session_state,
              },
            });
          }
          // Update user profile with Google info if needed
          await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              image: user.image ?? existingUser.image,
            },
          });
          return true;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      /* Step 1: update the token based on the user object */
      if (user) {
        token.admin = user.admin;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session = {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          firstName: token.firstName,
          lastName: token.lastName,
          admin: token.admin,
        },
      };
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      // This event is called when a new user signs up via any provider
      if (!user.firstName && user.name) {
        // Split the name if it comes from Google
        const nameParts = user.name.split(' ');
        const firstName = nameParts[0];
        const lastName =
          nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

        await prisma.user.update({
          where: { id: user.id },
          data: {
            firstName,
            lastName,
          },
        });
      }
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
};
