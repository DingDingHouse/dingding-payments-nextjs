"use client";

import { useAppSelector } from "@/lib/hooks";
import { Roles } from "@/lib/types";
import Script from "next/script";

export function TawkInit() {
    const currentUser = useAppSelector((state) => state.users.currentUser);

    if (!currentUser || currentUser.role.name !== Roles.PLAYER) {
        return null;
    }

    return (
        <Script
            src="https://embed.tawk.to/67c6df32b5d977190f13cebf/1ilgdfnm9"
            strategy="afterInteractive"
            crossOrigin="anonymous"
        />
    );
}