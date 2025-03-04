import { config } from "@/lib/config";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const apiResponse = await fetch(`${config.server}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
            credentials: 'include'
        });

        const data = await apiResponse.json();


        if (!apiResponse.ok) {
            return NextResponse.json(
                { message: data.message || 'Login failed' },
                { status: apiResponse.status }
            );
        }

        const { accessToken, user } = data.data;

        // Get expiration from JWT token
        const tokenParts = accessToken.split('.');
        const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
        const expiresIn = payload.exp - Math.floor(Date.now() / 1000);

        const response = NextResponse.json(
            { data: { accessToken, user } },
            { status: 200 }
        );

        // Set access token in cookie
        response.cookies.set('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: expiresIn,
            path: '/'

        });

        return response;

    } catch {
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}