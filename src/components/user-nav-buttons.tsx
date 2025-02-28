"use client"

import { Button } from "@/components/ui/button"
import { Users } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function UserNavButtons({ userId }: { userId: string }) {
    const pathname = usePathname()

    return (
        <div className="mb-6 overflow-x-auto">
            <div className="flex gap-2 min-w-max">
                <Button
                    asChild
                    variant={pathname.endsWith('/descendants') ? 'default' : 'outline'}
                >
                    <Link href={`/users/${userId}/descendants`}>
                        <Users className="h-4 w-4 mr-2" />
                        Descendants
                    </Link>
                </Button>
            </div>
        </div>
    )
}