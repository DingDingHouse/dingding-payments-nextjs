import { config } from "@/lib/config";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const authorization = request.headers.get('Authorization');
        const cookieToken = request.cookies.get('accessToken')?.value;

        // Use either the Authorization header or the cookie token
        const authHeader = authorization || (cookieToken ? `Bearer ${cookieToken}` : '');

        // Always create a response that will clear cookies
        const res = NextResponse.json(
            { message: 'Logged out successfully' },
            { status: 200 }
        );

        // Clear all auth cookies immediately
        res.cookies.delete('accessToken');
        res.cookies.delete('refreshToken');
        res.cookies.delete('twk_uuid_67c6df32b5d977190f13cebf');
        res.cookies.delete('TawkConnectionTime');
        res.cookies.delete('twk_idm_key');

        // Extra coverage for cookies that might have specific paths
        res.cookies.set('accessToken', '', {
            maxAge: 0,
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        });

        res.cookies.set('refreshToken', '', {
            maxAge: 0,
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        });

        // If we don't have an auth header, we're already "logged out"
        if (!authHeader) {
            return res;
        }

        // Try to logout from server, but don't let it block our response
        try {
            const response = await fetch(`${config.server}/api/auth/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            console.log('Server logout response:', response.status);

            // Try to parse the response
            const data = await response.json().catch(() => null);


            // Log server response for debugging but don't change our success response
            if (!response.ok) {
                console.log('Server logout returned error:', data?.error || response.statusText);
                // The error doesn't matter - we've already cleared the cookies
            }
        } catch (serverError) {
            console.error('Error during server logout:', serverError);
            // Again, this error doesn't impact our response - cookies are cleared
        }

        // Always return success with cleared cookies
        return res;

    } catch (error) {
        console.error('Unexpected error during logout:', error);

        // Even on catastrophic error, clear cookies and return success
        const res = NextResponse.json(
            { message: 'Logged out with errors' },
            { status: 200 }
        );

        // Clear cookies
        res.cookies.delete('accessToken');
        res.cookies.delete('refreshToken');

        return res;
    }
}