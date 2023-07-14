import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import prisma from '@/libs/prisma';
import { PrismaAdapter } from '@next-auth/prisma-adapter';

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			// The name to display on the sign in form (e.g. "Sign in with...")
			name: "Credentials",
			// `credentials` is used to generate a form on the sign in page.
			// You can specify which fields should be submitted, by adding keys to the `credentials` object.
			// e.g. domain, username, password, 2FA token, etc.
			// You can pass any HTML attribute to the <input> tag through the object.
			credentials: {
				email: { label: "Email", type: "text" },
				password: { label: "Password", type: "password" },
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
	],
	adapter: PrismaAdapter(prisma),
	secret: process.env.NEXTAUTH_SECRET,
	session: { strategy: "jwt" },
	callbacks: {
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
};
