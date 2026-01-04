import { NextResponse } from 'next/server';
import { decrypt } from '@/lib/auth';

const protectedRoutes = ['/dashboard'];
const publicRoutes = ['/login', '/register'];

export default async function middleware(req) {
    const path = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
    const isPublicRoute = publicRoutes.some((route) => path.startsWith(route));

    const sessionCookie = req.cookies.get('session')?.value;
    let session = null;

    if (sessionCookie) {
        try {
            session = await decrypt(sessionCookie);
        } catch (e) {
            console.error('Failed to verify session:', e);
        }
    }

    // 1. Redirect to /login if accessing protected route without session
    if (isProtectedRoute && !session) {
        return NextResponse.redirect(new URL('/login', req.nextUrl));
    }

    // 2. Redirect to /dashboard if accessing public route with session
    if (isPublicRoute && session) {
        return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
