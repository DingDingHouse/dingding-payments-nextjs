import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const accessToken = request.cookies.get('accessToken');

    const publicPaths = ['/login', '/register'];

    // Check if the path is public
    const isPublicPath = publicPaths.includes(path);

    // If there's no token and the path is not public, redirect to login
    if (!accessToken && !isPublicPath) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // If there's a token and the path is public, redirect to home
    if (accessToken && isPublicPath) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // For protected routes, verify token and add authorization header
    if (accessToken && !isPublicPath) {
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('Authorization', `Bearer ${accessToken.value}`);

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // Add api routes to matcher, except for login
        '/api/auth/logout',
        '/api/users/:path*',
        '/((?!api|_next/static|_next/image|favicon.ico).*)'
    ]
};