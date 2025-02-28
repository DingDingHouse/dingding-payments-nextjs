"use server";

import { cookies } from "next/headers";

export default async function getCookie(name: string): Promise<string | null> {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(name);
    return cookie?.value || null;
}