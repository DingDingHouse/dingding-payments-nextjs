import { config } from "@/lib/config";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const authorization = request.headers.get('Authorization');
        if (!authorization) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            )
        }

        const body = await request.json();
        const response = await fetch(`${config.server}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Authorization': authorization,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
            credentials: 'include'
        });

        const data = await response.json();
        if (!response.ok) {
            return NextResponse.json(
                { message: data.message || 'Registration failed' },
                { status: response.status }
            );
        }

        return NextResponse.json(data, { status: response.status });

    } catch {
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}