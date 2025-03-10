"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { ChevronLeft } from "lucide-react";

export default function BackButton() {
    const router = useRouter();

    return (
        <span
            onClick={() => router.back()}
            className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Wallets
        </span>
    );
}