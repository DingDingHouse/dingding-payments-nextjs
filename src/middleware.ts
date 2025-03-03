import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const accessToken = request.cookies.get('accessToken');

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
        return new NextResponse(null, {
            status: 200,
            headers: {
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_SERVER_URL!,
            },
        });
    }

    const publicPaths = ['/login', '/register', '/api/auth/login'];
    const isPublicPath = publicPaths.includes(path);

    // Handle API routes
    if (path.startsWith('/api/')) {
        if (!accessToken && !isPublicPath) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        if (accessToken && !isPublicPath) {
            try {
                const tokenParts = accessToken.value.split('.');
                const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());

                if (payload.exp <= Math.floor(Date.now() / 1000)) {
                    const response = NextResponse.redirect(new URL('/login', request.url));
                    response.cookies.delete('accessToken');
                    return response;
                }
            } catch (error) {
                const response = NextResponse.redirect(new URL('/login', request.url));
                response.cookies.delete('accessToken');
                return response;
            }
        }

        return NextResponse.next();
    }

    // Handle page routes
    if (!accessToken && !isPublicPath) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (accessToken && isPublicPath) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/api/:path*',
        '/((?!_next/static|_next/image|favicon.ico).*)'
    ]
};