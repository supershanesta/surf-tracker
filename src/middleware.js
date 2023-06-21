import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

// In rewrite method you pass a page folder name(as a string). which // you create to handle underConstraction  functionalty.
export async function middleware(req, ev) {
	const { pathname } = req.nextUrl;
	const protectedPaths = ["/surf-session", "/surf-rating"];
	const adminPaths = ["/admin"];
	const matchesProtectedPath = protectedPaths.some((path) =>
		pathname.startsWith(path)
	);
	console.log(req.url);
	if (matchesProtectedPath) {
		const token = await getToken({ req });
		if (!token) {
			const url = new URL(`/api/auth/signin`, req.url);
			url.searchParams.set("callbackUrl", encodeURI(req.url));
			return NextResponse.redirect(url);
		}
		const matchesAdminPaths = adminPaths.some((path) =>
			pathname.startsWith(path)
		);
		if (!token.admin && matchesAdminPaths) {
			const url = new URL(`/403`, req.url);
			return NextResponse.rewrite(url);
		}
	}
	return NextResponse.next();
}
