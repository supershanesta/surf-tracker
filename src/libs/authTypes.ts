import { DefaultSession } from 'next-auth';

/** Example on how to extend the built-in session types */
declare module "next-auth" {
	interface User {
		/** This is an example. You can find me in types/next-auth.d.ts */
		admin: boolean;
		firstName: string;
		lastName: string;
		id: string;
	}
	interface Session extends DefaultSession {
		user?: User;
	}
}

/** Example on how to extend the built-in types for JWT */
declare module "next-auth/jwt" {
	interface JWT {
		/** This is an example. You can find me in types/next-auth.d.ts */
		admin: boolean;
		firstName: string;
		lastName: string;
		id: string;
	}
}


/** Example on how to extend the built-in types for JWT */
declare module "next-auth/jwt" {
	interface JWT {
		/** This is an example. You can find me in types/next-auth.d.ts */
		admin: boolean;
		firstName: string;
		lastName: string;
		id: string;
	}
}
